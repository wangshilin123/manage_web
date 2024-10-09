import { NButton } from 'naive-ui';
import type { Component } from 'vue';
import { PermissionsEnum } from '@/enums/permissionsEnum';

// 定义操作项接口，继承自 NButton 的部分属性
export interface ActionItem extends Partial<InstanceType<typeof NButton>> {
  // 点击事件处理函数
  onClick?: Fn;
  // 按钮文本
  label?: string;
  // 按钮类型
  type?: 'success' | 'error' | 'warning' | 'info' | 'primary' | 'default';
  // 自定义颜色，设置后会覆盖 type 的样式
  color?: string;
  // 按钮图标
  icon?: Component;
  // 气泡确认框配置
  popConfirm?: PopConfirm;
  // 是否禁用
  disabled?: boolean;
  // 是否显示分隔线
  divider?: boolean;
  // 权限控制，可以是单个权限或权限数组
  auth?: PermissionsEnum | PermissionsEnum[] | string | string[];
  // 业务逻辑控制是否显示，可以是布尔值或函数
  ifShow?: boolean | ((action: ActionItem) => boolean);
}

// 定义气泡确认框接口
export interface PopConfirm {
  // 确认框标题
  title: string;
  // 确认按钮文本
  okText?: string;
  // 取消按钮文本
  cancelText?: string;
  // 确认回调函数
  confirm: Fn;
  // 取消回调函数
  cancel?: Fn;
  // 确认框图标
  icon?: Component;
}
