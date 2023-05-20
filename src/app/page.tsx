"use client";

import { useState } from "react";
import { Role } from "@/types/enum";
import { IChatGPTMessage } from "@/types/openai";
import { scrollToBottom } from "@/common/scroller";
import { delay } from "@/common/helper";
import chatStyle from "./styles/chat.module.css";
import footerStyle from "./styles/footer.module.css";
import buttonStyle from "./styles/button.module.css";
import { Formatter } from "@/common/formatter";

export default function Home() {
  const formatter = new Formatter();
  // are you in the process of answering
  const [loading, setLoading] = useState(false);
  // input box content
  const [input, setInput] = useState("");
  // set the message object of OpenAi
  const [messages, setMessages] = useState<IChatGPTMessage[]>([
    {
      role: Role.user,
      content: "Hi, I'm OpenAI Chatbot.",
    },
    {
      role: Role.assistant,
      content: "How can I help you?",
    },
  ]);

  /**
   * 生成对话
   * @param e
   * @returns
   */
  const generateChat = async (
    e: React.MouseEvent<HTMLButtonElement>,
    isReset: boolean
  ) => {
    if (loading) {
      return;
    }

    if (!input.trim().length) {
      return;
    }

    e.preventDefault();
    setLoading(true);

    // 先将刚刚的问题插入到消息列表当中
    const bodyParams = [
      ...messages,
      {
        role: Role.user,
        content: input,
      },
    ];

    const newBodyParams = [
      {
        role: Role.user,
        content: input,
      },
    ];
    setMessages(bodyParams);
    await delay();
    scrollToBottom();

    try {
      // 发送异步请求给服务端
      // 通过服务端来调用opanai的接口
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: isReset ? newBodyParams : bodyParams,
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
      let newMessages: IChatGPTMessage[] = [];

      // 不断更新stream的数据内容，实现打字效果
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        answer = `${answer}${decoder.decode(value)}`;
        newMessages = [
          ...bodyParams,
          {
            role: Role.assistant,
            content: answer,
          },
        ];
        setMessages(newMessages);
        scrollToBottom();
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

  // 发送按钮
  const sendBtn = (
    <button
      disabled={loading}
      className={buttonStyle.send}
      onClick={(e) => generateChat(e, false)}
    >
      <span>发送</span>
    </button>
  );

  // 重新发送按钮（仅仅包含一条message，会忽略上下文）
  const resetBtn = (
    <button
      disabled={loading}
      className={buttonStyle.reset}
      onClick={(e) => generateChat(e, true)}
    >
      <span>重新发送</span>
    </button>
  );

  // 按钮组，决定是否出现《重新发送》这个按钮
  const btnGroup =
    messages.length >= 2 ? (
      <div className={footerStyle.toolbar}>
        {sendBtn}
        {resetBtn}
      </div>
    ) : (
      <div className={footerStyle.toolbar}>{sendBtn}</div>
    );

  // 表单模块
  const formGroup = (
    <textarea
      disabled={loading}
      value={input}
      onChange={(e) => setInput(e.target.value)}
      maxLength={500}
      placeholder={"e.g. What is React?"}
    />
  );

  // 对话内容
  const messagesContent = (
    <div className={chatStyle.chatList}>
      {messages.map((item, index) => (
        <div
          className={
            item.role === Role.user
              ? chatStyle.userItem
              : chatStyle.assistantItem
          }
          key={`${index}-${item.role}-${item.content}`}
        >
          <div
            className={
              item.role === Role.user
                ? chatStyle.userBubble
                : chatStyle.assistantBubble
            }
            dangerouslySetInnerHTML={{
              __html: item.content
                ? formatter.message(item.content)
                : "Unknow Message",
            }}
          />
        </div>
      ))}
    </div>
  );

  return (
    <main>
      <h1>Welcome to ChatNext</h1>
      {messages.length ? messagesContent : null}
      <div className={footerStyle.footer}>
        {formGroup}
        {btnGroup}
      </div>
    </main>
  );
}
