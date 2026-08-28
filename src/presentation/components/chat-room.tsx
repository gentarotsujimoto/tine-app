"use client";

import { useChat } from "@/presentation/hooks/use-chat";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";

interface ChatRoomProps {
  roomId: string;
}

export function ChatRoom({ roomId }: ChatRoomProps) {
  const { messages, uid, isReady, sendMessage } = useChat(roomId);

  return (
    <div className="mx-auto flex h-dvh max-w-2xl flex-col bg-white shadow-lg">
      <header className="border-b bg-emerald-600 px-4 py-3 font-semibold text-white">
        Tine チャット
      </header>
      <MessageList messages={messages} currentUid={uid} />
      <MessageInput onSend={sendMessage} disabled={!isReady} />
    </div>
  );
}
