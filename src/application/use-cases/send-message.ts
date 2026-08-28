import type { ChatRepository, SendMessageParams } from "@/domain/repositories/chat-repository";

export class SendMessageUseCase {
  constructor(private readonly chatRepository: ChatRepository) {}

  execute(roomId: string, params: SendMessageParams): Promise<void> {
    if (!params.text.trim()) {
      return Promise.resolve();
    }
    return this.chatRepository.sendMessage(roomId, params);
  }
}
