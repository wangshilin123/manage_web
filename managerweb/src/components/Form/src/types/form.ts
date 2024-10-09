import { ComponentType } from './index';
import type { CSSProperties } from 'vue';
import type { GridProps, GridItemProps } from 'naive-ui/lib/grid';
import type { ButtonProps } from 'naive-ui/lib/button';

// 定义表单项的结构
export interface FormSchema {
  field: string;                          // 字段名
  label: string;                          // 标签文本
  labelMessage?: string;                  // 标签附加信息
  labelMessageStyle?: object | string;    // 标签附加信息样式
  defaultValue?: any;                     // 默认值
  component?: ComponentType;              // 组件类型
  componentProps?: object;                // 组件属性
  slot?: string;                          // 插槽名
  rules?: object | object[];              // 验证规则
  giProps?: GridItemProps;                // Grid Item 属性
  isFull?: boolean;                       // 是否占满宽度
  suffix?: string;                        // 后缀
}

// 定义表单属性
export interface FormProps {
  model?: Recordable;                     // 表单数据模型
  labelWidth?: number | string;           // 标签宽度
  schemas?: FormSchema[];                 // 表单项配置
  inline: boolean;                        // 是否内联布局
  layout?: string;                        // 布局方式
  size: string;                           // 尺寸
  labelPlacement: string;                 // 标签位置
  isFull: boolean;                        // 是否占满宽度
  showActionButtonGroup?: boolean;        // 是否显示操作按钮组
  showResetButton?: boolean;              // 是否显示重置按钮
  resetButtonOptions?: Partial<ButtonProps>; // 重置按钮选项
  showSubmitButton?: boolean;             // 是否显示提交按钮
  showAdvancedButton?: boolean;           // 是否显示高级按钮
  submitButtonOptions?: Partial<ButtonProps>; // 提交按钮选项
  submitButtonText?: string;              // 提交按钮文本
  resetButtonText?: string;               // 重置按钮文本
  gridProps?: GridProps;                  // Grid 属性
  giProps?: GridItemProps;                // Grid Item 属性
  resetFunc?: () => Promise<void>;        // 重置函数
  submitFunc?: () => Promise<void>;       // 提交函数
  submitOnReset?: boolean;                // 重置时是否提交
  baseGridStyle?: CSSProperties;          // 基础 Grid 样式
  collapsedRows?: number;                 // 折叠行数
}

// 定义表单操作类型
export interface FormActionType {
  submit: () => Promise<any>;             // 提交表单
  setProps: (formProps: Partial<FormProps>) => Promise<void>; // 设置表单属性
  setSchema: (schemaProps: Partial<FormSchema[]>) => Promise<void>; // 设置表单项配置
  setFieldsValue: (values: Recordable) => void; // 设置表单字段值
  clearValidate: (name?: string | string[]) => Promise<void>; // 清除验证
  getFieldsValue: () => Recordable;       // 获取表单字段值
  resetFields: () => Promise<void>;       // 重置表单字段
  validate: (nameList?: any[]) => Promise<any>; // 验证表单
  setLoading: (status: boolean) => void;  // 设置加载状态
}

// 定义注册函数类型
export type RegisterFn = (formInstance: FormActionType) => void;

// 定义 useForm 返回类型
export type UseFormReturnType = [RegisterFn, FormActionType];