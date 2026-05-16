import { NextRequest } from "next/server";
import { groq, MODEL, buildSystemPrompt } from "@/lib/ai";
import { logEvent } from "@/lib/analytics";

export const runtime = "edge";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  const { messages, category } = await req.json();

  if (!messages?.length) {
    return new Response("Missing messages", { status: 400 });
  }

  const stream = await groq.chat.completions.create({
    model: MODEL,
    max_tokens: 1024,
    stream: true,
    messages: [
      { role: "system", content: buildSystemPrompt(category ?? null) },
      ...(messages as ChatMessage[]),
    ],
  });

  let fullResponse = "";

  const readableStream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) {
            fullResponse += text;
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();

        logEvent({
          t: new Date().toISOString(),
          cat: category ?? null,
          msgs: messages.length,
          isDecision: /^\*\*[A-Z]/.test(fullResponse.trim()),
        });
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(readableStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
