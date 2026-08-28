import {
  signInAnonymously as firebaseSignInAnonymously,
  onAuthStateChanged as firebaseOnAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebase-client";
import type {
  AuthRepository,
  AuthenticatedUser,
} from "@/domain/repositories/auth-repository";

export class FirebaseAuthRepository implements AuthRepository {
  async signInAnonymously(): Promise<AuthenticatedUser> {
    const credential = await firebaseSignInAnonymously(auth);
    return { uid: credential.user.uid };
  }

  onAuthStateChanged(callback: (uid: string | null) => void): () => void {
    return firebaseOnAuthStateChanged(auth, (user) => {
      callback(user ? user.uid : null);
    });
  }
}
