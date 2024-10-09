<template>
    <!-- 主表单组件 -->
    <n-form v-bind="getBindValue" :model="formModel" ref="formElRef">
      <n-grid v-bind="getGrid">
        <!-- 遍历表单项 -->
        <n-gi v-bind="schema.giProps" v-for="schema in getSchema" :key="schema.field">
          <n-form-item :label="schema.label" :path="schema.field">
            <!-- 标签名右侧温馨提示 -->
            <template #label v-if="schema.labelMessage">
              {{ schema.label }}
              <n-tooltip trigger="hover" :style="schema.labelMessageStyle">
                <template #trigger>
                  <n-icon size="18" class="text-gray-400 cursor-pointer">
                    <QuestionCircleOutlined />
                  </n-icon>
                </template>
                {{ schema.labelMessage }}
              </n-tooltip>
            </template>
  
            <!-- 自定义插槽 -->
            <template v-if="schema.slot">
              <slot
                :name="schema.slot"
                :model="formModel"
                :field="schema.field"
                :value="formModel[schema.field]"
              ></slot>
            </template>
  
            <!-- NCheckbox 组件 -->
            <template v-else-if="schema.component === 'NCheckbox'">
              <n-checkbox-group v-model:value="formModel[schema.field]">
                <n-space>
                  <n-checkbox
                    v-for="item in schema.componentProps.options"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </n-space>
              </n-checkbox-group>
            </template>
  
            <!-- NRadioGroup 组件 -->
            <template v-else-if="schema.component === 'NRadioGroup'">
              <n-radio-group v-model:value="formModel[schema.field]">
                <n-space>
                  <n-radio
                    v-for="item in schema.componentProps.options"
                    :key="item.value"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </n-radio>
                </n-space>
              </n-radio-group>
            </template>
  
            <!-- 动态渲染表单组件 -->
            <component
              v-else
              v-bind="getComponentProps(schema)"
              :is="schema.component"
              v-model:value="formModel[schema.field]"
              :class="{ isFull: schema.isFull != false && getProps.isFull }"
            />
  
            <!-- 组件后面的内容 -->
            <template v-if="schema.suffix">
              <slot
                :name="schema.suffix"
                :model="formModel"
                :field="schema.field"
                :value="formModel[schema.field]"
              ></slot>
            </template>
          </n-form-item>
        </n-gi>
  
        <!-- 提交、重置、展开、收起按钮 -->
        <n-gi
          :span="isInline ? '' : 24"
          :suffix="isInline ? true : false"
          #="{ overflow }"
          v-if="getProps.showActionButtonGroup"
        >
          <n-space
            align="center"
            :justify="isInline ? 'end' : 'start'"
            :style="{ 'margin-left': `${isInline ? 12 : getProps.labelWidth}px` }"
          >
            <!-- 提交按钮 -->
            <n-button
              v-if="getProps.showSubmitButton"
              v-bind="getSubmitBtnOptions"
              @click="handleSubmit"
              :loading="loadingSub"
              attr-type="submit"
            >{{ getProps.submitButtonText }}</n-button>
  
            <!-- 重置按钮 -->
            <n-button
              v-if="getProps.showResetButton"
              v-bind="getResetBtnOptions"
              @click="resetFields"
            >{{ getProps.resetButtonText }}</n-button>
  
            <!-- 展开/收起按钮 -->
            <n-button
              type="primary"
              text
              icon-placement="right"
              v-if="isInline && getProps.showAdvancedButton"
              @click="unfoldToggle"
            >
              <template #icon>
                <n-icon size="14" class="unfold-icon" v-if="overflow">
                  <DownOutlined />
                </n-icon>
                <n-icon size="14" class="unfold-icon" v-else>
                  <UpOutlined />
                </n-icon>
              </template>
              {{ overflow ? '展开' : '收起' }}
            </n-button>
          </n-space>
        </n-gi>
      </n-grid>
    </n-form>
  </template>
  
  <script lang="ts">
  import { defineComponent, reactive, ref, computed, unref, onMounted, watch } from 'vue';
  import { createPlaceholderMessage } from './helper.ts';
  import { useFormEvents } from './hooks/useFormEvents';
  import { useFormValues } from './hooks/useFormValues';
  
  import { basicProps } from './props';
  import { DownOutlined, UpOutlined, QuestionCircleOutlined } from '@vicons/antd';
  
  import type { Ref } from 'vue';
  import type { GridProps } from 'naive-ui/lib/grid';
  import type { FormSchema, FormProps, FormActionType } from './types/form';
  
  import { isArray } from '@/utils/is/index';
  import { deepMerge } from '@/utils';
  
  export default defineComponent({
    name: 'BasicForm',
    components: { DownOutlined, UpOutlined, QuestionCircleOutlined },
    props: {
      ...basicProps,
    },
    emits: ['reset', 'submit', 'register'],
    setup(props, { emit, attrs }) {
      // 默认表单模型
      const defaultFormModel = ref<Recordable>({});
      // 响应式表单模型
      const formModel = reactive<Recordable>({});
      // 表单属性引用
      const propsRef = ref<Partial<FormProps>>({});
      // 表单架构引用
      const schemaRef = ref<Nullable<FormSchema[]>>(null);
      // 表单元素引用
      const formElRef = ref<Nullable<FormActionType>>(null);
      // 网格是否折叠
      const gridCollapsed = ref(true);
      // 提交加载状态
      const loadingSub = ref(false);
      // 是否已更新默认值
      const isUpdateDefaultRef = ref(false);
  
      // 计算提交按钮选项
      const getSubmitBtnOptions = computed(() => {
        return Object.assign(
          {
            size: props.size,
            type: 'primary',
          },
          props.submitButtonOptions
        );
      });
  
      // 计算重置按钮选项
      const getResetBtnOptions = computed(() => {
        return Object.assign(
          {
            size: props.size,
            type: 'default',
          },
          props.resetButtonOptions
        );
      });
  
      // 获取组件属性
      function getComponentProps(schema) {
        const compProps = schema.componentProps ?? {};
        const component = schema.component;
        return {
          clearable: true,
          placeholder: createPlaceholderMessage(unref(component)),
          ...compProps,
        };
      }
  
      // 计算表单属性
      const getProps = computed((): FormProps => {
        const formProps = { ...props, ...unref(propsRef) } as FormProps;
        const rulesObj: any = {
          rules: {},
        };
        const schemas: any = formProps.schemas || [];
        schemas.forEach((item) => {
          if (item.rules && isArray(item.rules)) {
            rulesObj.rules[item.field] = item.rules;
          }
        });
        return { ...formProps, ...unref(rulesObj) };
      });
  
      // 判断是否为内联布局
      const isInline = computed(() => {
        const { layout } = unref(getProps);
        return layout === 'inline';
      });
  
      // 计算网格属性
      const getGrid = computed((): GridProps => {
        const { gridProps } = unref(getProps);
        return {
          ...gridProps,
          collapsed: isInline.value ? gridCollapsed.value : false,
          responsive: 'screen',
        };
      });
  
      // 计算绑定值
      const getBindValue = computed(
        () => ({ ...attrs, ...props, ...unref(getProps) } as Recordable)
      );
  
      // 计算表单架构
      const getSchema = computed((): FormSchema[] => {
        const schemas: FormSchema[] = unref(schemaRef) || (unref(getProps).schemas as any);
        for (const schema of schemas) {
          const { defaultValue } = schema;
          if (defaultValue) {
            schema.defaultValue = defaultValue;
          }
        }
        return schemas as FormSchema[];
      });
  
      // 使用表单值相关的钩子
      const { handleFormValues, initDefault } = useFormValues({
        defaultFormModel,
        getSchema,
        formModel,
      });
  
      // 使用表单事件相关的钩子
      const { handleSubmit, validate, resetFields, getFieldsValue, clearValidate, setFieldsValue } =
        useFormEvents({
          emit,
          getProps,
          formModel,
          getSchema,
          formElRef: formElRef as Ref<FormActionType>,
          defaultFormModel,
          loadingSub,
          handleFormValues,
        });
  
      // 切换展开/折叠状态
      function unfoldToggle() {
        gridCollapsed.value = !gridCollapsed.value;
      }
  
      // 设置表单属性
      async function setProps(formProps: Partial<FormProps>): Promise<void> {
        propsRef.value = deepMerge(unref(propsRef) || {}, formProps);
      }
  
      // 表单操作类型
      const formActionType: Partial<FormActionType> = {
        getFieldsValue,
        setFieldsValue,
        resetFields,
        validate,
        clearValidate,
        setProps,
        submit: handleSubmit,
      };
  
      // 监听架构变化
      watch(
        () => getSchema.value,
        (schema) => {
          if (unref(isUpdateDefaultRef)) {
            return;
          }
          if (schema?.length) {
            initDefault();
            isUpdateDefaultRef.value = true;
          }
        }
      );
  
      // 组件挂载时初始化
      onMounted(() => {
        initDefault();
        emit('register', formActionType);
      });
  
      return {
        formElRef,
        formModel,
        getGrid,
        getProps,
        getBindValue,
        getSchema,
        getSubmitBtnOptions,
        getResetBtnOptions,
        handleSubmit,
        resetFields,
        loadingSub,
        isInline,
        getComponentProps,
        unfoldToggle,
      };
    },
  });
  </script>
  
  <style lang="less" scoped>
  .isFull {
    width: 100%;
    justify-content: flex-start;
  }
  
  .unfold-icon {
    display: flex;
    align-items: center;
    height: 100%;
    margin-left: -3px;
  }
  </style>