"use client";

import { useCallback, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { Message } from "@/domain/entities/message";
import { auth } from "@/infrastructure/firebase/firebase-client";
import {
  subscribeToMessagesUseCase,
  sendMessageUseCase,
} from "@/infrastructure/config/container";

function toDisplayName(email: string): string {
  return email.split("@")[0];
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
    return onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        setUid(user.uid);
        setDisplayName(toDisplayName(user.email));
        setIsReady(true);
      }
    });
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
