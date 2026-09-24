import type { ChatMessage } from "./AiChatSidebar";

interface AiChatMessagesProps {
  messages: ChatMessage[];
}

export function AiChatMessages({ messages }: AiChatMessagesProps) {
  return (
    <div className="relative min-h-0 flex-1 overflow-y-auto px-4 py-5">
      {messages.length === 0 && (
        <p className="absolute inset-0 flex items-center justify-center px-8 text-center text-4xl font-medium tracking-tight shimmer-text">
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
                : "rounded-bl-sm bg-neutral-800 text-neutral-200"
            }`}
          >
            {message.content}
          </p>
        </div>
      ))}
    </div>
  );
}
