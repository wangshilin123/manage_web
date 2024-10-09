import { ComponentType } from './types/index';

/**
 * @description: 根据组件类型生成占位符消息
 * @param {ComponentType} component - 组件类型
 * @returns {string} 对应的占位符消息
 */
export function createPlaceholderMessage(component: ComponentType) {
  // 对于输入类组件，返回"请输入"
  if (component === 'NInput') return '请输入';
  
  // 对于选择类组件，返回"请选择"
  if (
    ['NPicker', 'NSelect', 'NCheckbox', 'NRadio', 'NSwitch', 'NDatePicker', 'NTimePicker'].includes(
      component
    )
  )
    return '请选择';
  
  // 对于其他类型的组件，返回空字符串
  return '';
}

// 定义日期相关的组件类型
const DATE_TYPE = ['DatePicker', 'MonthPicker', 'WeekPicker', 'TimePicker'];

/**
 * @description: 生成包含所有日期相关组件类型的数组
 * @returns {string[]} 包含所有日期相关组件类型的数组
 */
function genType() {
  return [...DATE_TYPE, 'RangePicker'];
}

/**
 * 导出时间字段类型数组
 */
export const dateItemType = genType();

/**
 * @description: 根据组件类型返回默认值
 * @param {string} component - 组件类型
 * @returns {string | null | undefined} 组件的默认值
 */
export function defaultType(component) {
  // 对于输入框，返回空字符串
  if (component === 'NInput') return '';
  
  // 对于数字输入框，返回 null
  if (component === 'NInputNumber') return null;
  
  // 对于选择类组件，返回空字符串；其他情况返回 undefined
  return [
    'NPicker',
    'NSelect',
    'NCheckbox',
    'NRadio',
    'NSwitch',
    'NDatePicker',
    'NTimePicker',
  ].includes(component)
    ? ''
    : undefined;
}