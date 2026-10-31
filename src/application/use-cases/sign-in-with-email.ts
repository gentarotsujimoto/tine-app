import type { AuthRepository, AuthenticatedUser } from "@/domain/repositories/auth-repository";

export class SignInWithEmailUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(email: string, password: string): Promise<AuthenticatedUser> {
    return this.authRepository.signInWithEmailAndPassword(email, password);
  }
}
