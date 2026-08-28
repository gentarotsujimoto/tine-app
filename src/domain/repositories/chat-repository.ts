import type { Message } from "@/domain/entities/message";

export interface SendMessageParams {
  text: string;
  senderId: string;
  displayName: string;
}

export interface ChatRepository {
  /**
   * Subscribes to the messages of a room in real time.
   * Returns an unsubscribe function.
   */
  subscribeToMessages(
    roomId: string,
    onChange: (messages: Message[]) => void
  ): () => void;

  sendMessage(roomId: string, params: SendMessageParams): Promise<void>;
}
