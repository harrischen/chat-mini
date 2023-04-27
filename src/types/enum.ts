export enum CompletionModelMap {
  "gpt-3.5-turbo" = "gpt-3.5-turbo",
  "gpt-3.5-turbo-0301" = "gpt-3.5-turbo-0301",
  "gpt-4" = "gpt-4",
  "gpt-4-0314" = "gpt-4-0314",
  "gpt-4-32k" = "gpt-4-32k",
  "gpt-4-32k-0314" = "gpt-4-32k-0314",
}

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
}

export enum HttpStatusCode {
  OK = 200,
  ParamsError = 400,
}

/**
 * 角色
 * 参考 https://github.com/openai/openai-node/blob/master/api.ts
 */
export enum Role {
  system = "system",
  user = "user",
  assistant = "assistant",
}
