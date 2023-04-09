import { Configuration, OpenAIApi } from "openai";

/**
 * 封装一个openai的初始化模块
 * @returns
 */
export function GetOpenApi() {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_API_ORGANIZATION,
  });

  return new OpenAIApi(configuration);
}
