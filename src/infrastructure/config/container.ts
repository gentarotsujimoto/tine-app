import { FirebaseAuthRepository } from "@/infrastructure/firebase/firebase-auth-repository";
import { FirebaseChatRepository } from "@/infrastructure/firebase/firebase-chat-repository";
import { SignInAnonymouslyUseCase } from "@/application/use-cases/sign-in-anonymously";
import { SubscribeToMessagesUseCase } from "@/application/use-cases/subscribe-to-messages";
import { SendMessageUseCase } from "@/application/use-cases/send-message";

// 簡易的な DI コンテナ。
// インフラ層の実装を切り替えたい場合はここだけを差し替える。
const authRepository = new FirebaseAuthRepository();
const chatRepository = new FirebaseChatRepository();

export const signInAnonymouslyUseCase = new SignInAnonymouslyUseCase(authRepository);
export const subscribeToMessagesUseCase = new SubscribeToMessagesUseCase(chatRepository);
export const sendMessageUseCase = new SendMessageUseCase(chatRepository);
