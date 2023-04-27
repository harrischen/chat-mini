import { CompletionModelMap } from "@/types/enum";
import { IChatGPTMessage, OpenAIStreamPayload } from "@/types/openai";
import {
  ParsedEvent,
  ReconnectInterval,
  createParser,
} from "eventsource-parser";

export const config = {
  runtime: "edge",
};

export async function POST(req: Request): Promise<Response> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing env var from OpenAI");
  }

  const { messages } = (await req.json()) as {
    messages?: IChatGPTMessage[];
  };

  if (!(messages?.length && messages?.[0].content)) {
    return new Response("No prompt in the request", { status: 400 });
  }

  const payload: Partial<OpenAIStreamPayload> = {
    model: CompletionModelMap["gpt-3.5-turbo-0301"],
    messages,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
}

async function OpenAIStream(payload: Partial<OpenAIStreamPayload>) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  let counter = 0;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
    },
    body: JSON.stringify({
      model: payload.model,
      messages: payload.messages,
      temperature: payload.temperature,
      top_p: payload.top_p,
      frequency_penalty: payload.frequency_penalty,
      presence_penalty: payload.presence_penalty,
      stream: payload.stream,
      n: payload.n,
    }),
  });

  const stream = new ReadableStream({
    async start(controller) {
      function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type === "event") {
          const data = event.data;
          if (data === "[DONE]") {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta?.content || "";
            if (counter < 2 && (text.match(/\n/) || []).length) {
              return;
            }
            const queue = encoder.encode(text);
            controller.enqueue(queue);
            counter++;
          } catch (e) {
            controller.error(e);
          }
        }
      }

      const parser = createParser(onParse);
      for await (const chunk of res.body as any as IterableIterator<Uint8Array>) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
}
