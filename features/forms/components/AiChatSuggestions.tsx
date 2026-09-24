"use client";

interface AiChatSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

export function AiChatSuggestions({ suggestions, onSelect }: AiChatSuggestionsProps) {
  return (
    <div className="mt-5 w-full max-w-xs mx-auto mb-7 space-y-2">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          type="button"
          onClick={() => onSelect(suggestion)}
          className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-left text-xs text-neutral-400 transition-colors hover:border-neutral-600 hover:bg-neutral-800 hover:text-neutral-100"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}