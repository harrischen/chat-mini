export enum CompletionModelMap {
  "gpt-3.5-turbo" = "gpt-3.5-turbo",
  "gpt-4" = "gpt-4",
}

export enum FormatMessageMap {
  zero = "zero",
  partial = "partial",
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
