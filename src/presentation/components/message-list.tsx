"use client";

import { useEffect, useRef } from "react";
import type { Message } from "@/domain/entities/message";

interface MessageListProps {
  messages: Message[];
  currentUid: string | null;
}

export function MessageList({ messages, currentUid }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="flex-1 space-y-2 overflow-y-auto bg-gray-50 px-3 py-4">
      {messages.length === 0 && (
        <p className="mt-8 text-center text-sm text-gray-400">
          まだメッセージはありません。最初のメッセージを送ってみましょう。
        </p>
      )}
      {messages.map((message) => {
        const isOwn = message.senderId === currentUid;
        return (
          <div
            key={message.id}
            className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}
          >
            {!isOwn && (
              <span className="mb-0.5 ml-1 text-xs text-gray-500">
                {message.displayName}
              </span>
            )}
            <div
              className={`max-w-[75%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-sm shadow-sm ${
                isOwn
                  ? "rounded-br-sm bg-emerald-500 text-white"
                  : "rounded-bl-sm border bg-white text-gray-800"
              }`}
            >
              {message.text}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
