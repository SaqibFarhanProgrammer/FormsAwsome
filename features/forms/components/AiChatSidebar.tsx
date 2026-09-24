"use client";

import { FormEvent, useState } from "react";
import { ArrowUp, ChevronRight, Menu, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";

type ChatMessage = {
  id: number;
  role: "assistant" | "user";
  content: string;
};

interface AiChatSidebarProps {
  isOpen: boolean;
  onCollapse: () => void;
  onSendMessage?: (message: string) => void;
}

export function AiChatSidebar({ isOpen, onCollapse, onSendMessage }: AiChatSidebarProps) {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const submitMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = draft.trim();

    if (!message) return;

    setMessages((current) => [...current, { id: Date.now(), role: "user", content: message }]);
    setDraft("");
    onSendMessage?.(message);
  };

  return (
    <aside
      aria-hidden={!isOpen}
      className={`flex h-screen shrink-0 flex-col overflow-hidden border-l border-neutral-800 bg-neutral-950 transition-[width,opacity,transform] duration-300 ease-in-out ${
        isOpen
          ? "w-[min(22rem,32vw)] opacity-100"
          : "pointer-events-none w-0 translate-x-3 opacity-0"
      }`}
    >
      {/* Header - Dark Theme */}
      <div className="flex items-center justify-between px-4 py-">
        <Button
          variant="ghost"
          size="icon"
          className="size-7 rounded-md text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
          onClick={onCollapse}
          aria-label="Collapse AI"
          title="Collapse AI"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="3" />
            <path d="M15 3v18" />
            <path d="m10 15 3-3-3-3" />
          </svg>
        </Button>
      </div>

      {/* Messages Area - Dark Theme with Center Text */}
      <div className="relative min-h-0 flex-1 overflow-y-auto px-4 py-5">
        {messages.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center px-8">
            <p className="shimmer-text text-start text-3xl font-medium">
              Make Form In Seconds with AI
            </p>
          </div>
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

      {/* Input Area - ChatGPT Style Dark */}
      <div className="border-t border-neutral-800 p-3">
        <form
          onSubmit={submitMessage}
          className="rounded-2xl border border-neutral-700 bg-neutral-900 shadow-sm focus-within:border-neutral-600 focus-within:ring-1 focus-within:ring-neutral-700"
        >
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            placeholder="Ask anything about your form..."
            className="min-h-16 resize-none border-0 bg-transparent px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-500 shadow-none focus-visible:ring-0"
            aria-label="Message the form assistant"
          />
          <div className="flex items-center justify-between px-2 pb-2">
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
              aria-label="Attach a file"
            >
              <Paperclip className="size-4" />
            </Button>
            <Button
              type="submit"
              size="icon-sm"
              disabled={!draft.trim()}
              className="rounded-full bg-neutral-200 text-neutral-900 hover:bg-white disabled:bg-neutral-700 disabled:text-neutral-500"
              aria-label="Send message"
            >
              <ArrowUp className="size-4" />
            </Button>
          </div>
        </form>
      </div>
    </aside>
  );
}
