"use client";

import { FormEvent, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AiChatInput } from "./AiChatInput";
import { AiChatMessages } from "./AiChatMessages";
import { AiChatSuggestions } from "./AiChatSuggestions";

export type ChatMessage = {
  id: number;
  role: "assistant" | "user";
  content: string;
};

const suggestions = [
  "Create a content form",
  "Create a contact form",
  "Create a feedback form",
  "Create a registration form",
  "Create a survey form",
];

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
      className={`flex h-[95vh] shrink-0 flex-col overflow-hidden border-l border-neutral-800 bg-neutral-950 transition-[width,opacity,transform] duration-300 ease-in-out ${
        isOpen ? "w-96 opacity-100" : "pointer-events-none w-0 translate-x-3 opacity-0"
      }`}
    >
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
            width="36"
            height="36"
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

      <AiChatMessages messages={messages} />
      {messages.length === 0 && <AiChatSuggestions suggestions={suggestions} onSelect={setDraft} />}
      <AiChatInput
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onSubmit={submitMessage}
      />
    </aside>
  );
}
