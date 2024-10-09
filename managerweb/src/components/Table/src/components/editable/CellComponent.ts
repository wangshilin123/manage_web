import type { FunctionalComponent, defineComponent } from 'vue';
import type { ComponentType } from '../../types/componentType';
import { componentMap } from '@/components/Table/src/componentMap';

import { h } from 'vue';

import { NPopover } from 'naive-ui';

// 定义组件属性接口
export interface ComponentProps {
  component: ComponentType;  // 组件类型
  rule: boolean;             // 是否有规则
  popoverVisible: boolean;   // 气泡是否可见
  ruleMessage: string;       // 规则消息
}

// 定义函数式组件 CellComponent
export const CellComponent: FunctionalComponent = (
  { component = 'NInput', rule = true, ruleMessage, popoverVisible }: ComponentProps,
  { attrs }
) => {
  // 从 componentMap 中获取对应的组件
  const Comp = componentMap.get(component) as typeof defineComponent;

  // 创建默认组件
  const DefaultComp = h(Comp, attrs);

  // 如果没有规则，直接返回默认组件
  if (!rule) {
    return DefaultComp;
  }

  // 如果有规则，返回带有气泡提示的组件
  return h(
    NPopover,
    { 
      'display-directive': 'show',  // 显示指令
      show: !!popoverVisible,       // 控制气泡显示
      manual: 'manual'              // 手动控制模式
    },
    {
      // 触发器插槽，渲染默认组件
      trigger: () => DefaultComp,
      // 默认插槽，渲染规则消息
      default: () =>
        h(
          'span',
          {
            style: {
              color: 'red',
              width: '90px',
              display: 'inline-block',
            },
          },
          {
            default: () => ruleMessage,
          }
        ),
    }
  );
};
