"use client";

import { useState, useEffect } from "react";

const SESSION_KEY = "tine_authenticated";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    setIsAuthenticated(stored === "true");
    setIsLoading(false);
  }, []);

  function login(username: string, password: string): boolean {
    const validUsername = process.env.NEXT_PUBLIC_APP_USERNAME;
    const validPassword = process.env.NEXT_PUBLIC_APP_PASSWORD;

    if (username === validUsername && password === validPassword) {
      sessionStorage.setItem(SESSION_KEY, "true");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }

  return { isAuthenticated, isLoading, login };
}
