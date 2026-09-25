"use client";

import { useEffect, useState } from "react";

const loadingMessages = [
  "Thinking...",
  "Understanding your request...",
  "Analyzing your requirements...",
  "Planning the form structure...",
  "Choosing the right fields...",
  "Preparing the form fields...",
  "Organizing your questions...",
  "Setting up field options...",
  "Applying the right validations...",
  "Structuring the form...",
  "Generating your form...",
  "Putting everything together...",
  "Refining the form layout...",
  "Checking the form structure...",
  "Making final adjustments...",
  "Polishing the questions...",
  "Reviewing the generated form...",
  "Almost there...",
  "Finalizing your form...",
  "Your form is ready!",
];

const loadingDelays = [900, 1100, 1300, 1500, 1700, 1900, 2100, 2300, 2500, 2800];

export function LoadingMessage() {
  const [loadingText, setLoadingText] = useState(loadingMessages[0]);

  useEffect(() => {
    let messageIndex = 0;
    let timeoutId: number;

    const scheduleNextMessage = () => {
      const randomDelay = loadingDelays[Math.floor(Math.random() * loadingDelays.length)];

      timeoutId = window.setTimeout(() => {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        setLoadingText(loadingMessages[messageIndex]);
        scheduleNextMessage();
      }, randomDelay);
    };

    scheduleNextMessage();

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <div className="mb-3 flex justify-start">
      <p
        aria-live="polite"
        className="max-w-[88%] rounded-2xl rounded-bl-sm px-3 py-2 text-sm leading-5 text-neutral-400 shimmer-text"
      >
        {loadingText}
      </p>
    </div>
  );
}
