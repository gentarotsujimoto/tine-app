import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase-client";
import type { Message } from "@/domain/entities/message";
import type {
  ChatRepository,
  SendMessageParams,
} from "@/domain/repositories/chat-repository";

const MAX_MESSAGES = 200;

export class FirebaseChatRepository implements ChatRepository {
  subscribeToMessages(
    roomId: string,
    onChange: (messages: Message[]) => void
  ): () => void {
    const messagesRef = collection(db, "rooms", roomId, "messages");
    const messagesQuery = query(
      messagesRef,
      orderBy("createdAt", "asc"),
      limit(MAX_MESSAGES)
    );

    return onSnapshot(messagesQuery, (snapshot) => {
      const messages: Message[] = snapshot.docs.map((docSnapshot) => {
        const data = docSnapshot.data();
        const createdAt = data.createdAt as Timestamp | undefined;
        return {
          id: docSnapshot.id,
          text: data.text as string,
          senderId: data.senderId as string,
          displayName: data.displayName as string,
          createdAt: createdAt ? createdAt.toDate() : null,
        };
      });
      onChange(messages);
    });
  }

  async sendMessage(roomId: string, params: SendMessageParams): Promise<void> {
    const messagesRef = collection(db, "rooms", roomId, "messages");
    await addDoc(messagesRef, {
      text: params.text,
      senderId: params.senderId,
      displayName: params.displayName,
      createdAt: serverTimestamp(),
    });
  }
}
