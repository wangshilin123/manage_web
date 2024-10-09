import type { Component } from 'vue';
import {
  NInput,
  NSelect,
  NCheckbox,
  NInputNumber,
  NSwitch,
  NDatePicker,
  NTimePicker,
} from 'naive-ui';
import type { ComponentType } from './types/componentType';

// 定义组件事件枚举，映射组件名称到其主要事件名
export enum EventEnum {
  NInput = 'on-input',
  NInputNumber = 'on-input',
  NSelect = 'on-update:value',
  NSwitch = 'on-update:value',
  NCheckbox = 'on-update:value',
  NDatePicker = 'on-update:value',
  NTimePicker = 'on-update:value',
}

// 创建一个 Map 来存储组件类型和对应的组件
const componentMap = new Map<ComponentType, Component>();

// 将 Naive UI 的组件添加到 componentMap 中
componentMap.set('NInput', NInput);
componentMap.set('NInputNumber', NInputNumber);
componentMap.set('NSelect', NSelect);
componentMap.set('NSwitch', NSwitch);
componentMap.set('NCheckbox', NCheckbox);
componentMap.set('NDatePicker', NDatePicker);
componentMap.set('NTimePicker', NTimePicker);

/**
 * 添加新的组件到 componentMap 中
 * @param compName 组件名称
 * @param component 组件
 */
export function add(compName: ComponentType, component: Component) {
  componentMap.set(compName, component);
}

/**
 * 从 componentMap 中删除指定的组件
 * @param compName 要删除的组件名称
 */
export function del(compName: ComponentType) {
  componentMap.delete(compName);
}

// 导出 componentMap
export { componentMap };
