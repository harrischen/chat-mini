import hljs from "highlight.js";
import MarkdownIt from "markdown-it";
import markdownItHighlightjs from "markdown-it-highlightjs";
import "highlight.js/styles/atom-one-dark-reasonable.css";

export class Formatter {
  mkd: undefined | MarkdownIt = undefined;

  constructor() {
    this.mkd = this.initMkd();
  }

  initMkd() {
    return new MarkdownIt("commonmark", {
      breaks: true,
      linkify: true,
    }).use(markdownItHighlightjs, {
      hljs,
    });
  }

  message(val?: string) {
    let result = val?.trim();
    if (!result) {
      return "";
    }

    if (!this.mkd) {
      return "";
    }

    return this.mkd
      .enable(["code", "fence"])
      .enable(["autolink", "backticks", "image", "link", "newline"])
      .render(result)
      .trim();
  }
}
