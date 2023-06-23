import { Role } from "./enum";

/**
 * 单条消息
 */
export interface IChatGPTMessage {
  role: Role;
  content: string;
  time?: string;
}

/**
 * /v1/chat/completions 的响应体
 * https://platform.openai.com/docs/api-reference/chat
 */
export interface IChatResponse {
  id: string;
  model: Model;
  object: "chat.completion";
  created: number;
  choices: {
    index: number;
    message: Message;
    finish_reason: null | "stop";
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface OpenAIStreamPayload {
  model: string;
  messages: IChatGPTMessage[];
  /** 控制结果的随机性，如果希望结果更有创意可以尝试 0.9，或者希望有固定结果可以尝试 0.0 */
  temperature: number;
  /** 一个可用于代替 temperature 的参数，对应机器学习中 nucleus sampling（核采样），如果设置 0.1 意味着只考虑构成前 10% 概率质量的 tokens */
  top_p: number;
  /**
   * frequency_penalty是 -2.0 ~ 2.0 之间的数字，
   * 正值会根据新 tokens 在文本中的现有频率对其进行惩罚，从而降低模型逐字重复同一行的可能性（以恐怖故事为例）
   */
  frequency_penalty: number;
  /**
   * 控制主题的重复度
   * -2.0 ~ 2.0 之间的数字，正值会根据到目前为止是否出现在文本中来惩罚新 tokens，从而增加模型谈论新主题的可能性
   */
  presence_penalty: number;
  /** 生成结果时的最大单词数 */
  max_tokens: number;
  stream: boolean;
  n: number;
  /**
   * 停止字符
   * 最大长度为 4 的字符串列表，一旦生成的 tokens 包含其中的内容，将停止生成并返回结果
   */
  stop: string;
}
