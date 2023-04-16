"use client";

import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<String>("");

  const prompt = `Q: ${input} Generate a response with less than 200 characters.`;

  const generateResponse = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setResponse("");
    setLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setResponse((prev) => prev + chunkValue);
    }
    setLoading(false);
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
          {response && <div>{response}</div>}
        </div>
      </main>
    </>
  );
}
