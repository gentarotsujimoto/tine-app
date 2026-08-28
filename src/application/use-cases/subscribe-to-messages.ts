import type { Message } from "@/domain/entities/message";
import type { ChatRepository } from "@/domain/repositories/chat-repository";

export class SubscribeToMessagesUseCase {
  constructor(private readonly chatRepository: ChatRepository) {}

  execute(roomId: string, onChange: (messages: Message[]) => void): () => void {
    return this.chatRepository.subscribeToMessages(roomId, onChange);
  }
}
