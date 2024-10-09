import type { FormProps, FormActionType, UseFormReturnType } from '../types/form';
import type { DynamicProps } from '/#/utils';

import { ref, onUnmounted, unref, nextTick, watch } from 'vue';
import { isProdMode } from '@/utils/env';
import { getDynamicProps } from '@/utils';

type Props = Partial<DynamicProps<FormProps>>;

export function useForm(props?: Props): UseFormReturnType {
  // 表单实例引用
  const formRef = ref<Nullable<FormActionType>>(null);
  // 表单是否已加载的标志
  const loadedRef = ref<Nullable<boolean>>(false);

  // 获取表单实例
  async function getForm() {
    const form = unref(formRef);
    if (!form) {
      console.error(
        'The form instance has not been obtained, please make sure that the form has been rendered when performing the form operation!'
      );
    }
    await nextTick();
    return form as FormActionType;
  }

  // 注册表单实例
  function register(instance: FormActionType) {
    // 在生产模式下，组件卸载时清理引用
    isProdMode() &&
      onUnmounted(() => {
        formRef.value = null;
        loadedRef.value = null;
      });
    
    // 如果已加载且在生产模式下，且实例相同，则直接返回
    if (unref(loadedRef) && isProdMode() && instance === unref(formRef)) return;

    // 设置表单实例和加载标志
    formRef.value = instance;
    loadedRef.value = true;

    // 监听 props 变化，更新表单属性
    watch(
      () => props,
      () => {
        props && instance.setProps(getDynamicProps(props));
      },
      {
        immediate: true,
        deep: true,
      }
    );
  }

  // 表单方法
  const methods: FormActionType = {
    // 设置表单属性
    setProps: async (formProps: Partial<FormProps>) => {
      const form = await getForm();
      await form.setProps(formProps);
    },

    // 重置表单字段
    resetFields: async () => {
      getForm().then(async (form) => {
        await form.resetFields();
      });
    },

    // 清除表单验证
    clearValidate: async (name?: string | string[]) => {
      const form = await getForm();
      await form.clearValidate(name);
    },

    // 获取表单字段值
    getFieldsValue: <T>() => {
      return unref(formRef)?.getFieldsValue() as T;
    },

    // 设置表单字段值
    setFieldsValue: async <T>(values: T) => {
      const form = await getForm();
      await form.setFieldsValue<T>(values);
    },

    // 提交表单
    submit: async (): Promise<any> => {
      const form = await getForm();
      return form.submit();
    },

    // 验证表单
    validate: async (nameList?: any[]): Promise<Recordable> => {
      const form = await getForm();
      return form.validate(nameList);
    },

    // 设置加载状态
    setLoading: (value: boolean) => {
      loadedRef.value = value;
    },

    // 设置表单架构
    setSchema: async (values) => {
      const form = await getForm();
      form.setSchema(values);
    },
  };

  // 返回注册函数和表单方法
  return [register, methods];
}