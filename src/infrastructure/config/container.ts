import { FirebaseAuthRepository } from "@/infrastructure/firebase/firebase-auth-repository";
import { FirebaseChatRepository } from "@/infrastructure/firebase/firebase-chat-repository";
import { SignInWithEmailUseCase } from "@/application/use-cases/sign-in-with-email";
import { SubscribeToMessagesUseCase } from "@/application/use-cases/subscribe-to-messages";
import { SendMessageUseCase } from "@/application/use-cases/send-message";

const authRepository = new FirebaseAuthRepository();
const chatRepository = new FirebaseChatRepository();

export const signInWithEmailUseCase = new SignInWithEmailUseCase(authRepository);
export const subscribeToMessagesUseCase = new SubscribeToMessagesUseCase(chatRepository);
export const sendMessageUseCase = new SendMessageUseCase(chatRepository);
