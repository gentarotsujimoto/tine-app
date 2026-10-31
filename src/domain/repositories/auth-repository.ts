export interface AuthenticatedUser {
  uid: string;
}

export interface AuthRepository {
  signInWithEmailAndPassword(email: string, password: string): Promise<AuthenticatedUser>;

  onAuthStateChanged(callback: (uid: string | null) => void): () => void;
}
