import { AppError } from "@/lib/auth/appError";
import { z } from "zod";

const AIResponseSchema = z.object({
  answer: z.string(),
  code_example: z.string(),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
});

const jsonSchema = {
  type: "object",
  properties: {
    answer: {
      type: "string",
      description: "The direct answer to the user query tailored to their skill level.",
    },
    code_example: {
      type: "string",
      description: "A code snippet if applicable, otherwise an empty string.",
    },
    difficulty: {
      type: "string",
      enum: ["Beginner", "Intermediate", "Advanced"],
      description: "Suggested difficulty level for the user.",
    },
  },
  required: ["answer", "code_example", "difficulty"],
  additionalProperties: false,
};

export async function mistralai(query: string) {
  const apiKey = process.env.MISTRAL_API_KEY;

  if (!apiKey) {
    throw new AppError("MISTRAL_API_KEY is not configured", 500);
  }

  const systemInstruction = `
You are a coding assistant.


Answer the user's query according to their experience level.

Provide:
- A concise and direct answer.
- A code example when applicable.
- The appropriate difficulty level.

Return only JSON matching the provided schema.
`;

  try {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral-large-latest",

        messages: [
          {
            role: "system",
            content: systemInstruction,
          },
          {
            role: "user",
            content: query,
          },
        ],

        response_format: {
          type: "json_schema",
          json_schema: {
            name: "coding_assistant_response",
            strict: true,
            schema: jsonSchema,
          },
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();

      console.error("Mistral API Error:", {
        status: response.status,
        body: errorBody,
      });

      throw new AppError(`Mistral API request failed: ${response.status}`, response.status);
    }

    const responseData = await response.json();

    const rawText = responseData.choices?.[0]?.message?.content;

    if (typeof rawText !== "string") {
      throw new AppError("Mistral returned an empty response", 500);
    }

    const parsed = JSON.parse(rawText);

    const validated = AIResponseSchema.safeParse(parsed);

    if (!validated.success) {
      console.error("Invalid AI response:", validated.error.flatten());

      throw new AppError("AI returned an invalid response format", 500);
    }

    return validated.data;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    console.error("Mistral service error:", error);

    throw new AppError("AI service failed", 500);
  }
}
