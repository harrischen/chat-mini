import MarkdownIt from "markdown-it";
import { FormatMessageMap } from "../types/enum";

/** 多种 markdown-it 配置 */
const markdownItMap = {
  zero: new MarkdownIt("zero"),
  partial: new MarkdownIt("zero", {
    breaks: true,
    linkify: true,
  })
    .enable(["code", "fence"])
    .enable(["autolink", "backticks", "image", "link", "newline"]),
};

/**
 * 格式化消息
 * @param message 
 * @param mode 
 * @returns 
 */
export function formatMessage(message?: string, mode = FormatMessageMap.zero) {
  let result = message?.trim();
  if (!result) {
    return "";
  }
  result = result.replace(/\n/g, "==BREAK=PLACEHOLDER==");
  result = result.replace(
    / {2,}/g,
    (match) => " " + "==SPACE=PLACEHOLDER==".repeat(match.length - 1)
  );
  result = markdownItMap[mode].render(result).trim();
  result = result.replace(/==SPACE=PLACEHOLDER==/g, "&nbsp;");
  result = result.replace(/==BREAK=PLACEHOLDER==/g, "<br>");
  return result;
}
