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

/**
 * 获取apiKey
 * @returns
 */
function GetApiKey(): string {
  return process.env.OPENAI_API_KEY || "";
}

/**
 * 通过stream方式请求openai的对话消息
 * @param req
 * @returns
 */
export async function POST(req: Request) {
  // 验证apiKey的有效性
  const verifyResApiKey = VerifyApiKey(GetApiKey());
  if (verifyResApiKey.status !== 200) {
    return new Response(verifyResApiKey.message);
  }

  // 验证messages的有效性
  const verifyResMessages = await VerifyMessages(req);
  if (verifyResMessages.status !== 200) {
    return new Response(verifyResMessages.message as string);
  }

  const payload: Partial<OpenAIStreamPayload> = {
    model: CompletionModelMap["gpt-3.5-turbo-0301"],
    messages: verifyResMessages.message as IChatGPTMessage[],
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

/**
 * 发送对话逻辑
 * @param payload
 * @returns
 */
async function OpenAIStream(payload: Partial<OpenAIStreamPayload>) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  let counter = 0;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GetApiKey()}`,
    },
    body: JSON.stringify({
      model: payload.model,
      messages: payload.messages?.map(item => {
        return {
          role: item.role,
          content: item.content,
        }
      }),
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

/**
 * 验证apiKey的有效性
 * @param apiKey
 * @returns
 */
function VerifyApiKey(apiKey: string) {
  if (!apiKey) {
    return {
      status: 400,
      message: "Missing env var from OpenAI",
    };
  }

  return {
    status: 200,
    message: "OPENAI_API_KEY 有效",
  };
}

/**
 * 验证message的有效性，并返回message
 * @param messages
 * @returns
 */
async function VerifyMessages(req: Request) {
  const { messages } = (await req.json()) as {
    messages?: IChatGPTMessage[];
  };

  if (!(messages?.length && messages[messages.length - 1]?.content)) {
    return {
      status: 400,
      message: "No prompt in the request",
    };
  }

  return {
    status: 200,
    message: messages,
  };
}
