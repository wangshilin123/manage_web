import { isArray, isFunction, isObject, isString, isNullOrUnDef } from '@/utils/is';
import { unref } from 'vue';
import type { Ref, ComputedRef } from 'vue';
import type { FormSchema } from '../types/form';
import { set } from 'lodash-es';

// 定义 useFormValues 函数的参数接口
interface UseFormValuesContext {
  defaultFormModel: Ref<any>;  // 默认表单模型的响应式引用
  getSchema: ComputedRef<FormSchema[]>;  // 获取表单架构的计算属性
  formModel: Recordable;  // 当前表单模型
}

export function useFormValues({ defaultFormModel, getSchema, formModel }: UseFormValuesContext) {
  // 处理表单值
  function handleFormValues(values: Recordable) {
    if (!isObject(values)) {
      return {};
    }
    const res: Recordable = {};
    for (const item of Object.entries(values)) {
      let [, value] = item;
      const [key] = item;
      // 跳过空键、空数组、函数和 null/undefined 值
      if (
        !key ||
        (isArray(value) && value.length === 0) ||
        isFunction(value) ||
        isNullOrUnDef(value)
      ) {
        continue;
      }
      // 如果值是字符串，去除首尾空格
      if (isString(value)) {
        value = value.trim();
      }
      // 使用 lodash 的 set 函数设置嵌套对象的值
      set(res, key, value);
    }
    return res;
  }

  // 初始化默认值
  function initDefault() {
    const schemas = unref(getSchema);  // 解包 getSchema 计算属性
    const obj: Recordable = {};
    schemas.forEach((item) => {
      const { defaultValue } = item;
      // 如果存在默认值，则设置到默认表单模型和当前表单模型中
      if (!isNullOrUnDef(defaultValue)) {
        obj[item.field] = defaultValue;
        formModel[item.field] = defaultValue;
      }
    });
    defaultFormModel.value = obj;  // 更新默认表单模型的值
  }

  return { handleFormValues, initDefault };
}