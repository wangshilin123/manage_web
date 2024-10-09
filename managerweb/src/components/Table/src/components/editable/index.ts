import type { BasicColumn } from '@/components/Table/src/types/table';
import { h, Ref } from 'vue';

import EditableCell from './EditableCell.vue';

/**
 * 渲染可编辑单元格
 * @param column - 列配置
 * @returns 渲染函数
 */
export function renderEditCell(column: BasicColumn) {
  return (record, index) => {
    const _key = column.key;
    const value = record[_key];

    // 为记录添加编辑相关的方法
    record.onEdit = async (edit: boolean, submit = false) => {
      if (!submit) {
        // 如果不是提交，则直接设置编辑状态
        record.editable = edit;
      }

      if (!edit && submit) {
        // 如果是提交编辑
        const res = await record.onSubmitEdit?.();
        if (res) {
          record.editable = false;
          return true;
        }
        return false;
      }
      // 如果是取消编辑
      if (!edit && !submit) {
        record.onCancelEdit?.();
      }
      return true;
    };

    // 返回可编辑单元格组件
    return h(EditableCell, {
      value,
      record,
      column,
      index,
    });
  };
}

/**
 * 定义可编辑行记录的类型
 */
export type EditRecordRow<T = Recordable> = Partial<
  {
    // 编辑状态切换函数
    onEdit: (editable: boolean, submit?: boolean) => Promise<boolean>;
    // 是否可编辑
    editable: boolean;
    // 取消编辑回调
    onCancel: Fn;
    // 提交编辑回调
    onSubmit: Fn;
    // 提交回调函数数组
    submitCbs: Fn[];
    // 取消回调函数数组
    cancelCbs: Fn[];
    // 验证回调函数数组
    validCbs: Fn[];
    // 编辑值的引用对象
    editValueRefs: Recordable<Ref>;
  } & T
>;
