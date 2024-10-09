import type { Ref } from 'vue';
import type { BasicTableProps, TableActionType } from '@/components/Table/src/types/table';
import { provide, inject, ComputedRef } from 'vue';

// 创建一个唯一的 Symbol 作为 provide/inject 的 key
const key = Symbol('s-table');

// 定义 Instance 类型，包含表格操作类型和额外的属性
type Instance = TableActionType & {
  // 引用表格包裹元素的 ref
  wrapRef: Ref<Nullable<HTMLElement>>;
  // 计算属性，返回一个可记录的对象
  getBindValues: ComputedRef<Recordable>;
};

// 定义 RetInstance 类型，基于 Instance 但修改了 getBindValues 的类型
type RetInstance = Omit<Instance, 'getBindValues'> & {
  // 计算属性，返回表格的基本属性
  getBindValues: ComputedRef<BasicTableProps>;
};

/**
 * 创建表格上下文
 * @param instance 表格实例，包含表格的各种操作和状态
 */
export function createTableContext(instance: Instance) {
  // 使用 provide 将表格实例注入到上下文中
  provide(key, instance);
}

/**
 * 使用表格上下文
 * @returns 返回表格实例，包含表格的各种操作和状态
 */
export function useTableContext(): RetInstance {
  // 使用 inject 从上下文中获取表格实例，并断言其类型为 RetInstance
  return inject(key) as RetInstance;
}