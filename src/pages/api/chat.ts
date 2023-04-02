import { Configuration, OpenAIApi } from "openai";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

const configuration = new Configuration({
  organization: "",
  apiKey: "",
});

const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "假设你现在有10000人民币，你有什么好的赚钱思路",
    max_tokens: 2048,
    temperature: 0.2,
  });

  console.log(completion.data.choices);
  res.status(200).json({ name: "John Doe" });
}
