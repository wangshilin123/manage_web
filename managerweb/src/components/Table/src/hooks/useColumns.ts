import { ref, Ref, ComputedRef, unref, computed, watch, toRaw, h } from 'vue';
import type { BasicColumn, BasicTableProps } from '@/components/Table/src/types/table';
import { isEqual, cloneDeep } from 'lodash-es';
import { isArray, isString, isBoolean, isFunction } from '@/utils/is';
import { usePermission } from '@/hooks/web/usePermission';
import { ActionItem } from '@/components/Table/src/types/table';
import { renderEditCell } from '@/components/Table/src/components/editable';
import { NTooltip, NIcon } from 'naive-ui';
import { FormOutlined } from '@vicons/antd';

/**
 * 处理表格列的 hook
 * @param propsRef - 表格属性的计算引用
 * @returns 包含列操作的各种方法
 */
export function useColumns(propsRef: ComputedRef<BasicTableProps>) {
  // 创建列的响应式引用
  const columnsRef = ref(unref(propsRef).columns) as unknown as Ref<BasicColumn[]>;
  // 缓存原始列配置
  let cacheColumns = unref(propsRef).columns;

  // 计算属性：获取处理后的列
  const getColumnsRef = computed(() => {
    const columns = cloneDeep(unref(columnsRef));
    handleActionColumn(propsRef, columns);
    if (!columns) return [];
    return columns;
  });

  const { hasPermission } = usePermission();

  /**
   * 检查动作项是否应该显示
   * @param action - 动作项
   * @returns 是否显示
   */
  function isIfShow(action: ActionItem): boolean {
    const ifShow = action.ifShow;
    let isIfShow = true;
    if (isBoolean(ifShow)) {
      isIfShow = ifShow;
    }
    if (isFunction(ifShow)) {
      isIfShow = ifShow(action);
    }
    return isIfShow;
  }

  /**
   * 渲染带有工具提示的元素
   * @param trigger - 触发元素
   * @param content - 提示内容
   * @returns 渲染的虚拟节点
   */
  const renderTooltip = (trigger, content) => {
    return h(NTooltip, null, {
      trigger: () => trigger,
      default: () => content,
    });
  };

  // 计算属性：获取页面显示的列
  const getPageColumns = computed(() => {
    const pageColumns = unref(getColumnsRef);
    const columns = cloneDeep(pageColumns);
    return columns
      .filter((column) => {
        return hasPermission(column.auth as string[]) && isIfShow(column);
      })
      .map((column) => {
        // 默认设置 ellipsis 为 true
        column.ellipsis = typeof column.ellipsis === 'undefined' ? { tooltip: true } : false;
        const { edit } = column;
        if (edit) {
          column.render = renderEditCell(column);
          if (edit) {
            const title: any = column.title;
            column.title = () => {
              return renderTooltip(
                h('div', { class: 'flex items-center' }, [
                  h('span', { style: { 'margin-right': '5px' } }, title),
                  h(
                    NIcon,
                    {
                      size: 14,
                    },
                    {
                      default: () => h(FormOutlined),
                    }
                  ),
                ]),
                '该列可编辑'
              );
            };
          }
        }
        return column;
      });
  });

  // 监听 props 中列的变化
  watch(
    () => unref(propsRef).columns,
    (columns) => {
      columnsRef.value = columns;
      cacheColumns = columns;
    }
  );

  /**
   * 处理操作列
   * @param propsRef - 表格属性的计算引用
   * @param columns - 列数组
   */
  function handleActionColumn(propsRef: ComputedRef<BasicTableProps>, columns: BasicColumn[]) {
    const { actionColumn } = unref(propsRef);
    if (!actionColumn) return;
    !columns.find((col) => col.key === 'action') &&
      columns.push({
        ...(actionColumn as any),
      });
  }

  /**
   * 设置列
   * @param columnList - 列配置列表
   */
  function setColumns(columnList: string[]) {
    const columns: any[] = cloneDeep(columnList);
    if (!isArray(columns)) return;

    if (!columns.length) {
      columnsRef.value = [];
      return;
    }
    const cacheKeys = cacheColumns.map((item) => item.key);
    // 处理拖拽排序
    if (!isString(columns[0])) {
      columnsRef.value = columns;
    } else {
      const newColumns: any[] = [];
      cacheColumns.forEach((item) => {
        if (columnList.includes(item.key)) {
          newColumns.push({ ...item });
        }
      });
      if (!isEqual(cacheKeys, columns)) {
        newColumns.sort((prev, next) => {
          return cacheKeys.indexOf(prev.key) - cacheKeys.indexOf(next.key);
        });
      }
      columnsRef.value = newColumns;
    }
  }

  /**
   * 获取列配置
   * @returns 列配置数组
   */
  function getColumns(): BasicColumn[] {
    const columns = toRaw(unref(getColumnsRef));
    return columns.map((item) => {
      return { ...item, title: item.title, key: item.key, fixed: item.fixed || undefined };
    });
  }

  /**
   * 获取缓存的列配置
   * @param isKey - 是否只返回键
   * @returns 缓存的列配置
   */
  function getCacheColumns(isKey?: boolean): any[] {
    return isKey ? cacheColumns.map((item) => item.key) : cacheColumns;
  }

  /**
   * 更新缓存列的单个字段
   * @param key - 列的键
   * @param value - 要更新的值
   */
  function setCacheColumnsField(key: string | undefined, value: Partial<BasicColumn>) {
    if (!key || !value) {
      return;
    }
    cacheColumns.forEach((item) => {
      if (item.key === key) {
        Object.assign(item, value);
        return;
      }
    });
  }

  return {
    getColumnsRef,
    getCacheColumns,
    setCacheColumnsField,
    setColumns,
    getColumns,
    getPageColumns,
  };
}
