"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/infrastructure/firebase/firebase-client";
import { signInWithEmailUseCase } from "@/infrastructure/config/container";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });
  }, []);

  async function login(email: string, password: string): Promise<boolean> {
    try {
      await signInWithEmailUseCase.execute(email, password);
      return true;
    } catch {
      return false;
    }
  }

  return { isAuthenticated, isLoading, login };
}
