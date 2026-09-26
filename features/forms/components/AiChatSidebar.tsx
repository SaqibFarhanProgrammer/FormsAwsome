"use client";

import { FormEvent, useEffect, useState } from "react";
import { PanelRightClose } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AiChatInput } from "./AiChatInput";
import { AiChatMessages } from "./AiChatMessages";
import { AiChatSuggestions } from "./AiChatSuggestions";
import axios from "axios";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useDispatch, useSelector } from "react-redux";
import { showAlert } from "@/redux/features/global/alertSlice";
import { setFormData } from "@/redux/features/form-builder/form.slice";
import { selectFormState } from "@/redux/features/form-builder/form.selectors";

export type ChatMessage = {
  id: number;
  role: "assistant" | "user" | "error";
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
  const [loading, setLoading] = useState(false);
  const [remainingRequests, setRemainingRequests] = useState<number | null>(null);
  const dispatch = useDispatch();
  const currentForm = useSelector(selectFormState);

  useEffect(() => {
    let active = true;

    axios
      .get("/api/ai")
      .then((response) => {
        if (active && Array.isArray(response.data.history)) {
          setMessages(
            response.data.history.map((item: ChatMessage, index: number) => ({
              ...item,
              id: Date.now() + index,
            })),
          );
        }
        if (active && typeof response.data.remaining === "number") {
          setRemainingRequests(response.data.remaining);
        }
      })
      .catch(() => {
        // History is optional; the chat remains usable when it cannot be loaded.
      });

    return () => {
      active = false;
    };
  }, []);

  const submitMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = draft.trim();

    if (!message) return;

    try {
      setMessages((current) => [...current, { id: Date.now(), role: "user", content: message }]);
      setLoading(true);
      setDraft("");

      const response = await axios.post(
        "/api/ai",
        {
          prompt: message,
          currentForm,
        },
        {
          timeout: 60_000, // 1 minute
        },
      );

      if (typeof response.data.remaining === "number") {
        setRemainingRequests(response.data.remaining);
      }

      setMessages((current) => [
        ...current,
        { id: Date.now(), role: "assistant", content: response.data.result.message },
      ]);

      const aiFormData = response.data.result.formData;

      if (aiFormData) {
        dispatch(setFormData(aiFormData));
      }
      setLoading(false);
      onSendMessage?.(message);
    } catch (error) {
      const message = getErrorMessage(error, "Something went wrong. Please try again.");
      const remaining = axios.isAxiosError(error) ? error.response?.data?.remaining : undefined;

      if (typeof remaining === "number") {
        setRemainingRequests(remaining);
      }

      setMessages((current) => [...current, { id: Date.now(), role: "error", content: message }]);
      setLoading(false);
      dispatch(showAlert({ message, type: "danger" }));
    }
  };

  return (
    <aside
      aria-hidden={!isOpen}
      className={`flex h-[95vh] shrink-0 flex-col overflow-hidden border-l border-neutral-800 bg-background transition-[width,opacity,transform] duration-300 ease-in-out ${
        isOpen ? "w-96 opacity-100" : "pointer-events-none w-0 translate-x-3 opacity-0"
      }`}
    >
      <div className="flex items-center justify-between px-2 py-2">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-md text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
          onClick={onCollapse}
          aria-label="Collapse AI"
          title="Collapse AI"
        >
          <PanelRightClose className="size-15" strokeWidth={2} />
        </Button>
      </div>
      <AiChatMessages messages={messages} loading={loading} />
      {messages.length === 0 && <AiChatSuggestions suggestions={suggestions} onSelect={setDraft} />}
      {remainingRequests !== null && (
        <p className="px-3 pb-1 text-center text-xs text-neutral-500">
          {remainingRequests} AI messages remaining today
        </p>
      )}
      <AiChatInput
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onSubmit={submitMessage}
        disabled={loading}
      />
    </aside>
  );
}
