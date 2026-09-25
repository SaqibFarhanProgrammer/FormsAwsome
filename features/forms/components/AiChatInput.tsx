"use client";

import type { ChangeEvent, FormEvent, KeyboardEvent } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";

interface AiChatInputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  disabled?: boolean;
}

export function AiChatInput({ value, onChange, onSubmit, disabled = false }: AiChatInputProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <div className="bord800 p-3">
      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-neutral-700 bg-neutral-950 shadow-sm focus-within:border-neutral-600 focus-within:ring-1 focus-within:ring-neutral-700"
      >
        <Textarea
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Ask anything about your form..."
          className="min-h-16 resize-none border-0 bg-transparent px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-500 shadow-none focus-visible:ring-0"
          aria-label="Message the form"
        />
        <div className="flex justify-end px-2 pb-2">
          <Button
            type="submit"
            size="icon-sm"
            disabled={disabled || !value.trim()}
            className="rounded-full text-white hover:bg-white disabled:bg-neutral-700 disabled:text-neutral-500"
            aria-label="Send message"
          >
            <ArrowUp className="size-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
