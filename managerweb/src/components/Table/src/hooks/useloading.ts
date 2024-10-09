import { ref, ComputedRef, unref, computed, watch } from 'vue';
import type { BasicTableProps } from '@/components/Table/src/types/table';

/**
 * 处理表格加载状态的 hook
 * @param props - 表格属性的计算引用
 * @returns 包含获取和设置加载状态的方法
 */
export function useLoading(props: ComputedRef<BasicTableProps>) {
  // 创建一个响应式引用，初始值为 props 中的 loading 值
  const loadingRef = ref(unref(props).loading);

  // 监听 props 中 loading 值的变化
  watch(
    () => unref(props).loading,
    (loading) => {
      // 当 props 中的 loading 值变化时，更新 loadingRef
      loadingRef.value = loading;
    }
  );

  // 创建一个计算属性，返回当前的 loading 状态
  const getLoading = computed(() => unref(loadingRef));

  /**
   * 设置加载状态
   * @param loading - 新的加载状态
   */
  function setLoading(loading: boolean) {
    loadingRef.value = loading;
  }

  // 返回获取和设置加载状态的方法
  return { getLoading, setLoading };
}
