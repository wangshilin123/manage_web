import { CSSProperties, VNodeChild } from 'vue';
import { createTypes, VueTypeValidableDef, VueTypesInterface } from 'vue-types';

// 定义 VueNode 类型，可以是 VNodeChild 或 JSX.Element
export type VueNode = VNodeChild | JSX.Element;

// 扩展 VueTypesInterface，添加 style 和 VNodeChild 属性
type PropTypes = VueTypesInterface & {
  readonly style: VueTypeValidableDef<CSSProperties>;
  readonly VNodeChild: VueTypeValidableDef<VueNode>;
};

// 创建基本的 propTypes 对象
const propTypes = createTypes({
  func: undefined,
  bool: undefined,
  string: undefined,
  number: undefined,
  object: undefined,
  integer: undefined,
}) as PropTypes;

// 扩展 propTypes，添加 style 和 VNodeChild 的自定义验证
propTypes.extend([
  {
    name: 'style',
    getter: true,
    type: [String, Object],
    default: undefined,
  },
  {
    name: 'VNodeChild',
    getter: true,
    type: undefined,
  },
]);

export { propTypes };
