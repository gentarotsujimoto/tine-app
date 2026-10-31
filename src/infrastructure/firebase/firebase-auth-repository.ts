import {
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  onAuthStateChanged as firebaseOnAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebase-client";
import type {
  AuthRepository,
  AuthenticatedUser,
} from "@/domain/repositories/auth-repository";

export class FirebaseAuthRepository implements AuthRepository {
  async signInWithEmailAndPassword(email: string, password: string): Promise<AuthenticatedUser> {
    const credential = await firebaseSignInWithEmailAndPassword(auth, email, password);
    return { uid: credential.user.uid };
  }

  onAuthStateChanged(callback: (uid: string | null) => void): () => void {
    return firebaseOnAuthStateChanged(auth, (user) => {
      callback(user ? user.uid : null);
    });
  }
}
