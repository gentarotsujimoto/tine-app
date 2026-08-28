"use client";

import { ChatRoom } from "@/presentation/components/chat-room";
import { LoginForm } from "@/presentation/components/login-form";
import { useAuth } from "@/presentation/hooks/use-auth";

export default function Home() {
  const { isAuthenticated, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-gray-50">
        <div className="text-gray-400">読み込み中...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  return <ChatRoom roomId="general" />;
}
