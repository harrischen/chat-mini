import { GetOpenApi } from "@/common/openapi";
import type { NextApiRequest, NextApiResponse } from "next";
import { CreateCompletionResponseChoicesInner, OpenAIApi } from "openai";

type Data = {
  message: string;
  data?: CreateCompletionResponseChoicesInner[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let openai: OpenAIApi | undefined = undefined;
  if (!openai) {
    openai = GetOpenApi();
  }

  const prompt = req.body?.prompt || "";
  console.log(req.body);

  if (!prompt) {
    return res.status(400).json({
      message: "Uh oh, no prompt was provided",
    });
  }

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "假设你现在有10000人民币，你有什么好的赚钱思路",
    max_tokens: 2048,
    temperature: 0.2,
  });

  console.log(completion.data.choices);

  res.status(200).json({
    message: "success",
    data: completion.data.choices,
  });
}
