import type { PaginationProps } from '../types/pagination';
import type { BasicTableProps } from '../types/table';
import { computed, unref, ref, ComputedRef, watch } from 'vue';

import { isBoolean } from '@/utils/is';
import { DEFAULTPAGESIZE, PAGESIZES } from '../const';

export function usePagination(refProps: ComputedRef<BasicTableProps>) {
  // 存储分页配置的响应式引用
  const configRef = ref<PaginationProps>({});
  // 控制是否显示分页的响应式引用
  const show = ref(true);

  // 监听 props 中 pagination 的变化
  watch(
    () => unref(refProps).pagination,
    (pagination) => {
      if (!isBoolean(pagination) && pagination) {
        // 更新分页配置
        configRef.value = {
          ...unref(configRef),
          ...(pagination ?? {}),
        };
      }
    }
  );

  // 计算属性：获取分页信息
  const getPaginationInfo = computed((): PaginationProps | boolean => {
    const { pagination } = unref(refProps);
    // 如果不显示分页或 pagination 为 false，返回 false
    if (!unref(show) || (isBoolean(pagination) && !pagination)) {
      return false;
    }
    // 返回合并后的分页配置
    return {
      page: 1, // 当前页
      pageSize: DEFAULTPAGESIZE, // 分页大小
      pageSizes: PAGESIZES, // 每页条数选项
      showSizePicker: true, // 显示每页条数选择器
      showQuickJumper: true, // 显示快速跳转
      prefix: (pagingInfo) => `共 ${pagingInfo.itemCount} 条`, // 前缀显示总条数
      ...(isBoolean(pagination) ? {} : pagination), // 合并用户提供的分页配置
      ...unref(configRef), // 合并内部存储的分页配置
    };
  });

  // 设置分页信息
  function setPagination(info: Partial<PaginationProps>) {
    const paginationInfo = unref(getPaginationInfo);
    configRef.value = {
      ...(!isBoolean(paginationInfo) ? paginationInfo : {}),
      ...info,
    };
  }

  // 获取分页信息
  function getPagination() {
    return unref(getPaginationInfo);
  }

  // 获取是否显示分页
  function getShowPagination() {
    return unref(show);
  }

  // 设置是否显示分页
  async function setShowPagination(flag: boolean) {
    show.value = flag;
  }

  // 返回分页相关的方法
  return { getPagination, getPaginationInfo, setShowPagination, getShowPagination, setPagination };
}
