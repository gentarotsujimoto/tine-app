#!/usr/bin/env node
/**
 * tine.mjs — Firestore バックエンドの CLI チャットクライアント
 *
 * 使い方:
 *   node scripts/tine.mjs            対話モード（新着を自動表示しつつ入力を送信）
 *   node scripts/tine.mjs -n 30      起動時に直近 30 件を表示（デフォルト 10）
 *   echo "やあ" | node scripts/tine.mjs --send  1 行だけ送って終了
 *
 * 環境変数:
 *   FIREBASE_SERVICE_ACCOUNT  Firebase サービスアカウント JSON 文字列（必須）
 *   TINE_NAME                 表示名（デフォルト: CLI）
 *   CHAT_EDITOR               メッセージ作成エディタ（デフォルト: nvim）
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import * as readline from "readline";
import { execSync } from "child_process";
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "fs";
import { tmpdir, hostname } from "os";
import { join } from "path";
import { randomUUID } from "crypto";

// --- 環境変数チェック -------------------------------------------------------
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.error("エラー: FIREBASE_SERVICE_ACCOUNT が設定されていません");
  process.exit(1);
}

initializeApp({ credential: cert(process.env.FIREBASE_SERVICE_ACCOUNT) });
const db = getFirestore();

const ROOM_ID = "general";
const ID_FILE = join(process.env.HOME, ".tine_chat_client_id");
const EDITOR_CMD =
  process.env.CHAT_EDITOR ||
  process.env.VISUAL ||
  process.env.EDITOR ||
  "nvim";
const DISPLAY_NAME = process.env.TINE_NAME || `CLI@${hostname().split(".")[0]}`;

// --- 自分の clientId（初回のみ生成して保存）---------------------------------
let MY_ID;
try {
  MY_ID = readFileSync(ID_FILE, "utf8").trim();
} catch {
  MY_ID = randomUUID();
  writeFileSync(ID_FILE, MY_ID);
}

// --- 引数処理 ---------------------------------------------------------------
let SEND_ONLY = false;
let LIMIT = 10;

for (let i = 2; i < process.argv.length; i++) {
  if (process.argv[i] === "-n") {
    LIMIT = parseInt(process.argv[++i], 10);
  } else if (process.argv[i] === "--send") {
    SEND_ONLY = true;
  } else {
    console.error(`unknown option: ${process.argv[i]}`);
    process.exit(1);
  }
}

// --- メッセージ整形 ---------------------------------------------------------
function fmt(msg) {
  const time = msg.createdAt
    ? new Date(msg.createdAt.toMillis()).toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "??:??:??";
  const isMe = msg.senderId === MY_ID;
  const who = isMe
    ? `\x1b[36m${msg.displayName || "あなた"}\x1b[0m`
    : `\x1b[33m${msg.displayName || (msg.senderId || "??").substring(0, 6)}\x1b[0m`;
  return `[${time}] ${who}: ${msg.text || ""}`;
}

const messagesRef = db
  .collection("rooms")
  .doc(ROOM_ID)
  .collection("messages");

// --- メッセージ送信 ---------------------------------------------------------
async function send(text) {
  await messagesRef.add({
    text,
    senderId: MY_ID,
    displayName: DISPLAY_NAME,
    createdAt: Timestamp.now(),
  });
}

// --- --send モード（1 行送って終了）-----------------------------------------
if (SEND_ONLY) {
  const chunks = [];
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => chunks.push(chunk));
  process.stdin.on("end", async () => {
    const text = chunks.join("").replace(/\n$/, "");
    if (text) await send(text);
    process.exit(0);
  });
} else {
  // --- 対話モード -----------------------------------------------------------
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

async function main() {
  // 直近メッセージを取得して表示
  const snapshot = await messagesRef
    .orderBy("createdAt", "asc")
    .limitToLast(LIMIT)
    .get();

  console.log(
    `=== Tine CLI Chat ===  (あなた: ${DISPLAY_NAME} [${MY_ID.substring(0, 6)}…]  終了: Ctrl-C または :q)`
  );

  let lastTimestamp = null;
  snapshot.docs.forEach((doc) => {
    const msg = doc.data();
    console.log(fmt(msg));
    if (msg.createdAt) lastTimestamp = msg.createdAt;
  });

  // リアルタイム購読 — 既存メッセージより後だけを受信
  const subscribeFrom = lastTimestamp || Timestamp.now();
  let rl;

  const unsubscribe = messagesRef
    .orderBy("createdAt", "asc")
    .where("createdAt", ">", subscribeFrom)
    .onSnapshot((querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const msg = change.doc.data();
          if (msg.senderId !== MY_ID) {
            process.stdout.write("\n" + fmt(msg) + "\n");
            if (rl) rl.prompt(true);
          }
        }
      });
    });

  // --- nvim で複数行メッセージ作成 -----------------------------------------
  function compose() {
    const tmpDir = mkdtempSync(join(tmpdir(), "tine_"));
    const tmpFile = join(tmpDir, "message.txt");
    writeFileSync(tmpFile, "");
    try {
      execSync(`${EDITOR_CMD} "${tmpFile}"`, { stdio: "inherit" });
      const content = readFileSync(tmpFile, "utf8");
      return content.replace(/\n$/, "");
    } finally {
      rmSync(tmpDir, { recursive: true, force: true });
    }
  }

  // --- 入力ループ -----------------------------------------------------------
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `> [Enter=${EDITOR_CMD}で作成 / 直接入力=1行送信 / :q=終了] `,
  });

  rl.prompt();

  rl.on("line", async (line) => {
    line = line.trim();

    if (line === ":q" || line === ":quit") {
      rl.close();
      return;
    }

    if (line === "") {
      // 空 Enter → エディタで複数行作成
      rl.pause();
      const text = compose();
      rl.resume();
      if (text) {
        await send(text);
        const now = new Date().toLocaleTimeString("ja-JP", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        console.log(`[${now}] \x1b[36m${DISPLAY_NAME}\x1b[0m: ${text}`);
      }
    } else {
      await send(line);
      const now = new Date().toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      console.log(`[${now}] \x1b[36m${DISPLAY_NAME}\x1b[0m: ${line}`);
    }

    rl.prompt();
  });

  rl.on("close", () => {
    unsubscribe();
    console.log("\nbye");
    process.exit(0);
  });

  process.on("SIGINT", () => {
    rl.close();
  });
}
