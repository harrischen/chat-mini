"use client";

import Head from "next/head";
import { useState } from "react";
import { Role } from "@/types/enum";
import { IChatGPTMessage } from "@/types/openai";

export default function Home() {
  // are you in the process of answering
  const [loading, setLoading] = useState(false);
  // input box content
  const [input, setInput] = useState("");
  // set the message object of OpenAi
  const [messages, setMessages] = useState<IChatGPTMessage[]>([]);

  const generateResponse = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);

    // 先将刚刚的问题插入到消息列表当中
    const bodyParams = [...messages, { role: Role.user, content: input }];
    setMessages(bodyParams);

    try {
      // 发送异步请求给服务端
      // 通过服务端来调用opanai的接口
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: bodyParams,
        }),
      });

      // 如果服务端返回的数据异常，则直接拦截
      if (!response.ok) {
        setMessages([
          ...bodyParams,
          {
            role: Role.assistant,
            content: response.statusText,
          },
        ]);
        throw new Error(response.statusText);
      }

      // 如果服务端返回的数据为空，则不需要做任何处理
      const data = response.body;
      if (!data) {
        return;
      }

      // 解包(其实就是处理stream数据)
      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let answer = "";

      // 不断更新stream的数据内容，实现打字效果
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        answer = `${answer}${decoder.decode(value)}`;
        setMessages([...bodyParams, { role: Role.assistant, content: answer }]);
      }
    } catch (err) {
      setMessages([
        ...bodyParams,
        {
          role: Role.assistant,
          content: (err as Error).message,
        },
      ]);
    } finally {
      // 当stream数据解析完之后，需要清空输入框的内容
      // 并重置Loading状态
      setInput("");
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>ChatGPT Mini App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome to my app</h1>
        <div>
          {messages.map((item, index) => (
            <div key={`${index}-${item.role}-${item.content}`}>
              <div>
                {item.role}
                {item.content}
              </div>
              <div>---------------------------------</div>
            </div>
          ))}
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          maxLength={200}
          placeholder={"e.g. What is React?"}
        />
        {!loading ? (
          <button onClick={(e) => generateResponse(e)}>
            Generate Response &rarr;
          </button>
        ) : (
          <button disabled>
            <div>...</div>
          </button>
        )}
      </main>
    </>
  );
}
