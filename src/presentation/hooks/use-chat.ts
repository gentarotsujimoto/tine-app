"use client";

import { useCallback, useEffect, useState } from "react";
import type { Message } from "@/domain/entities/message";
import {
  signInAnonymouslyUseCase,
  subscribeToMessagesUseCase,
  sendMessageUseCase,
} from "@/infrastructure/config/container";

function generateDisplayName(uid: string): string {
  return `ゲスト${uid.slice(0, 4).toUpperCase()}`;
}

interface UseChatResult {
  messages: Message[];
  uid: string | null;
  displayName: string;
  isReady: boolean;
  sendMessage: (text: string) => Promise<void>;
}

export function useChat(roomId: string): UseChatResult {
  const [messages, setMessages] = useState<Message[]>([]);
  const [uid, setUid] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    signInAnonymouslyUseCase.execute().then(({ uid: newUid }) => {
      if (cancelled) return;
      setUid(newUid);
      setDisplayName(generateDisplayName(newUid));
      setIsReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const unsubscribe = subscribeToMessagesUseCase.execute(roomId, setMessages);
    return () => unsubscribe();
  }, [roomId, isReady]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!uid || !text.trim()) return;
      await sendMessageUseCase.execute(roomId, {
        text,
        senderId: uid,
        displayName,
      });
    },
    [roomId, uid, displayName]
  );

  return { messages, uid, displayName, isReady, sendMessage };
}
