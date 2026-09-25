import { motion } from "motion/react";
import type { ChatMessage } from "./AiChatSidebar";
import { LoadingMessage } from "./LoadingMessage";

interface AiChatMessagesProps {
  messages: ChatMessage[];
  loading: boolean;
}

export function AiChatMessages({ messages, loading }: AiChatMessagesProps) {
  return (
    <div className="hide-scrollbar relative min-h-0 flex-1 overflow-y-auto px-4 py-5">
      {messages.length === 0 && (
        <p className="absolute inset-0 flex items-center justify-center px-8 text-center text-4xl font-light tracking-tighterer shimmer-text">
          Make Forms In Seconds with AI
        </p>
      )}

      {messages.map((message) => (
        <div
          key={message.id}
          className={`mb-3 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <p
            className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-5 ${
              message.role === "user"
                ? "rounded-br-sm bg-neutral-700 text-neutral-100"
                : message.role === "error"
                  ? "rounded-bl-sm bg-red-950/50 text-red-300"
                  : "rounded-bl-sm bg--800 text-neutral-200"
            }`}
          >
            {message.role !== "assistant"
              ? message.content
              : message.content.split(" ").map((word, index, words) => (
                  <motion.span
                    key={`${message.id}-${index}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.035 }}
                  >
                    {word}
                    {index < words.length - 1 ? " " : ""}
                  </motion.span>
                ))}
          </p>
        </div>
      ))}
      {loading && <LoadingMessage />}
    </div>
  );
}
