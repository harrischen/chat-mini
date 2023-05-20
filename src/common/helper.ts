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
