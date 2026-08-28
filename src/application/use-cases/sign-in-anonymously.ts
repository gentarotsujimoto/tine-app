import type { AuthRepository, AuthenticatedUser } from "@/domain/repositories/auth-repository";

export class SignInAnonymouslyUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(): Promise<AuthenticatedUser> {
    return this.authRepository.signInAnonymously();
  }
}
