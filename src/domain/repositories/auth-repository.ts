export interface AuthenticatedUser {
  uid: string;
}

export interface AuthRepository {
  signInAnonymously(): Promise<AuthenticatedUser>;

  /**
   * Subscribes to authentication state changes.
   * Returns an unsubscribe function.
   */
  onAuthStateChanged(callback: (uid: string | null) => void): () => void;
}
