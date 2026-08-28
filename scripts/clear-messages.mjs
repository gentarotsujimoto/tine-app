import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

initializeApp({ credential: cert(serviceAccount) });

const db = getFirestore();
const ROOM_ID = "general";
const BATCH_SIZE = 500;

async function deleteCollection(collectionRef) {
  let deleted = 0;

  while (true) {
    const snapshot = await collectionRef.limit(BATCH_SIZE).get();
    if (snapshot.empty) break;

    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    deleted += snapshot.size;
    console.log(`  ${deleted} 件削除済み...`);
  }

  return deleted;
}

async function main() {
  console.log(`rooms/${ROOM_ID}/messages を削除します...`);

  const messagesRef = db.collection("rooms").doc(ROOM_ID).collection("messages");
  const total = await deleteCollection(messagesRef);

  console.log(`完了: 合計 ${total} 件のメッセージを削除しました`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
