import { provide, inject } from 'vue';

// 创建一个唯一的 Symbol 作为 context 的 key
const key = Symbol('formElRef');

/**
 * 创建表单上下文
 * @param instance 表单实例
 */
export function createFormContext(instance) {
  // 使用 provide 提供表单实例
  provide(key, instance);
}

/**
 * 使用表单上下文
 * @returns 注入的表单实例
 */
export function useFormContext() {
  // 使用 inject 获取表单实例
  return inject(key);
}