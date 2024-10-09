import { tryOnMounted, tryOnUnmounted } from '@vueuse/core';
import { useDebounceFn } from '@vueuse/core';

// 定义窗口大小监听器的选项接口
interface WindowSizeOptions {
  once?: boolean;
  immediate?: boolean;
  listenerOptions?: AddEventListenerOptions | boolean;
}

// 自定义 hook 用于处理窗口调整大小事件
export function useWindowSizeFn<T>(fn: Fn<T>, wait = 150, options?: WindowSizeOptions) {
  // 初始化处理函数
  let handler = () => {
    fn();
  };

  // 创建处理函数的防抖版本
  const handleSize = useDebounceFn(handler, wait);
  handler = handleSize;

  // 开始监听调整大小事件的函数
  const start = () => {
    // 如果 immediate 选项为 true，立即调用处理函数
    if (options && options.immediate) {
      handler();
    }
    // 为窗口添加调整大小事件监听器
    window.addEventListener('resize', handler);
  };

  // 停止监听调整大小事件的函数
  const stop = () => {
    window.removeEventListener('resize', handler);
  };

  // 尝试在组件挂载时开始监听
  tryOnMounted(() => {
    start();
  });

  // 尝试在组件卸载时停止监听
  tryOnUnmounted(() => {
    stop();
  });

  // 返回手动开始和停止监听的函数
  return [start, stop];
}