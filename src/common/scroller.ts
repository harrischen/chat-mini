/**
 * 滚动到底部
 * 主要目的是为了解决在对话过程当中，内容是递增的
 * 需要在递增的过程当中，页面自动滚动到最底部，方便使用者能及时看到消息
 */
export function scrollToBottom() {
  window.scrollTo(0, document.body.scrollHeight);
}
