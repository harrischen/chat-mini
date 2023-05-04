import MarkdownIt from "markdown-it";

/**
 * 格式化消息
 * @param message
 * @param mode
 * @returns
 */
export function formatMessage(message?: string) {
  let result = message?.trim();
  if (!result) {
    return "";
  }

  const mkd = new MarkdownIt("zero", {
    breaks: true,
    linkify: true,
  });

  return mkd
    .enable(["code", "fence"])
    .enable(["autolink", "backticks", "image", "link", "newline"])
    .render(result)
    .trim();
}

/**
 * 错误处理方法
 * 避免主要逻辑里面一大段的try catch
 * const [data, err] = await to(promise)
 * @param promise
 */
export async function to<T>(promise: Promise<T>): Promise<[T, any]> {
  try {
    return [await promise, null] as [T, any];
  } catch (e) {
    return [null, e] as [any, any];
  }
}

/**
 * 延迟函数
 * @param time
 * @returns
 */
export async function delay(time = 1000 / 60) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, time);
  });
}
