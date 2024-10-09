import { ref, ComputedRef, unref, computed, onMounted, watchEffect, watch } from 'vue';
import type { BasicTableProps } from '../types/table';
import type { PaginationProps } from '../types/pagination';
import { isBoolean, isFunction, isArray } from '@/utils/is';
import { APISETTING } from '../const';

export function useDataSource(
  propsRef: ComputedRef<BasicTableProps>,
  { getPaginationInfo, setPagination, setLoading, tableData },
  emit
) {
  // 存储数据源的响应式引用
  const dataSourceRef = ref<Recordable[]>([]);

  // 监听数据源变化，更新表格数据
  watchEffect(() => {
    tableData.value = unref(dataSourceRef);
  });

  // 监听 props 中的 dataSource 变化
  watch(
    () => unref(propsRef).dataSource,
    () => {
      const { dataSource }: any = unref(propsRef);
      dataSource && (dataSourceRef.value = dataSource);
    },
    {
      immediate: true,
    }
  );

  // 计算属性：获取行键
  const getRowKey = computed(() => {
    const { rowKey }: any = unref(propsRef);
    return rowKey
      ? rowKey
      : () => {
          return 'key';
        };
  });

  // 计算属性：获取数据源引用
  const getDataSourceRef = computed(() => {
    const dataSource = unref(dataSourceRef);
    if (!dataSource || dataSource.length === 0) {
      return unref(dataSourceRef);
    }
    return unref(dataSourceRef);
  });

  // 获取数据的主要函数
  async function fetch(opt?) {
    try {
      setLoading(true);
      console.log("propsRef",propsRef);
      const { request, pagination, beforeRequest, afterRequest }: any = unref(propsRef);
      console.log("request",request);
      if (!request) return;
      // 组装分页信息
      const pageField = APISETTING.pageField;
      const sizeField = APISETTING.sizeField;
      const totalField = APISETTING.totalField;
      const listField = APISETTING.listField;
      const itemCount = APISETTING.countField;
      let pageParams = {};
      const { page = 1, pageSize = 10 } = unref(getPaginationInfo) as PaginationProps;

      // 根据分页配置设置参数
      if ((isBoolean(pagination) && !pagination) || isBoolean(getPaginationInfo)) {
        pageParams = {};
      } else {
        pageParams[pageField] = (opt && opt[pageField]) || page;
        pageParams[sizeField] = pageSize;
      }

      let params = {
        ...pageParams,
        ...opt,
      };
      // 执行请求前的钩子函数
      if (beforeRequest && isFunction(beforeRequest)) {
        params = (await beforeRequest(params)) || params;
      }
      // 发送请求
      const res = (await request(params)).result;
      const resultTotal = res.totalField;
      const currentPage = res.pageField;
      const total = res.itemCount;

      // 处理数据异常情况
      if (resultTotal) {
        const currentTotalPage = Math.ceil(total / pageSize);
        if (page > currentTotalPage) {
          setPagination({
            page: currentTotalPage,
            itemCount: total,
          });
          return await fetch(opt);
        }
      }
      let resultInfo = res.listField ? res.listField : [];
      console.log("resultInfo",resultInfo);
      // 执行请求后的钩子函数
      if (afterRequest && isFunction(afterRequest)) {
        resultInfo = (await afterRequest(resultInfo)) || resultInfo;
      }
      // 更新数据源和分页信息
      dataSourceRef.value = resultInfo;
      setPagination({
        page: currentPage,
        pageCount: resultTotal,
        itemCount: total,
      });
      if (opt && opt[pageField]) {
        setPagination({
          page: opt[pageField] || 1,
        });
      }
      // 触发获取成功事件
      emit('fetch-success', {
        items: unref(resultInfo),
        resultTotal,
      });
    } catch (error) {
      console.log("error",error);
      // 触发获取失败事件
      emit('fetch-error', error);
      dataSourceRef.value = [];
      setPagination({
        pageCount: 0,
      });
    } finally {
      setLoading(false);
    }
  }

  // 组件挂载后执行一次数据获取
  onMounted(() => {
    setTimeout(() => {
      fetch();
    }, 16);
  });

  // 设置表格数据
  function setTableData(values) {
    dataSourceRef.value = values;
  }

  // 获取数据源
  function getDataSource(): any[] {
    return getDataSourceRef.value;
  }

  // 重新加载数据
  async function reload(opt?) {
    await fetch(opt);
  }

  return {
    fetch,
    getRowKey,
    getDataSourceRef,
    getDataSource,
    setTableData,
    reload,
  };
}
