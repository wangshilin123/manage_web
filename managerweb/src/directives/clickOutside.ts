import { on } from '@/utils/domUtils';
import { isServer } from '@/utils/is';
import type { ComponentPublicInstance, DirectiveBinding, ObjectDirective } from 'vue';

// 定义文档处理器类型
type DocumentHandler = <T extends MouseEvent>(mouseup: T, mousedown: T) => void;

// 定义刷新列表类型
type FlushList = Map<
  HTMLElement,
  {
    documentHandler: DocumentHandler;
    bindingFn: (...args: unknown[]) => unknown;
  }
>;

// 存储绑定了指令的节点列表
const nodeList: FlushList = new Map();

let startClick: MouseEvent;

// 如果不是服务器端渲染
if (!isServer) {
  // 监听全局的 mousedown 事件
  on(document, 'mousedown', (e: MouseEvent) => (startClick = e));
  // 监听全局的 mouseup 事件
  on(document, 'mouseup', (e: MouseEvent) => {
    for (const { documentHandler } of nodeList.values()) {
      documentHandler(e, startClick);
    }
  });
}

// 创建文档处理器
function createDocumentHandler(el: HTMLElement, binding: DirectiveBinding): DocumentHandler {
  let excludes: HTMLElement[] = [];
  if (Array.isArray(binding.arg)) {
    excludes = binding.arg;
  } else {
    excludes.push(binding.arg as unknown as HTMLElement);
  }
  return function (mouseup, mousedown) {
    const popperRef = (
      binding.instance as ComponentPublicInstance<{
        popperRef: Nullable<HTMLElement>;
      }>
    ).popperRef;
    const mouseUpTarget = mouseup.target as Node;
    const mouseDownTarget = mousedown.target as Node;
    const isBound = !binding || !binding.instance;
    const isTargetExists = !mouseUpTarget || !mouseDownTarget;
    const isContainedByEl = el.contains(mouseUpTarget) || el.contains(mouseDownTarget);
    const isSelf = el === mouseUpTarget;

    const isTargetExcluded =
      (excludes.length && excludes.some((item) => item?.contains(mouseUpTarget))) ||
      (excludes.length && excludes.includes(mouseDownTarget as HTMLElement));
    const isContainedByPopper =
      popperRef && (popperRef.contains(mouseUpTarget) || popperRef.contains(mouseDownTarget));
    
    // 如果点击的是目标元素内部、自身、被排除的目标或者弹出框内部，则不触发
    if (
      isBound ||
      isTargetExists ||
      isContainedByEl ||
      isSelf ||
      isTargetExcluded ||
      isContainedByPopper
    ) {
      return;
    }
    // 触发绑定的函数
    binding.value();
  };
}

// 定义 ClickOutside 指令
const ClickOutside: ObjectDirective = {
  // 在绑定元素的父组件被挂载之前调用
  beforeMount(el, binding) {
    nodeList.set(el, {
      documentHandler: createDocumentHandler(el, binding),
      bindingFn: binding.value,
    });
  },
  // 在包含组件的 VNode 及其子 VNode 全部更新后调用
  updated(el, binding) {
    nodeList.set(el, {
      documentHandler: createDocumentHandler(el, binding),
      bindingFn: binding.value,
    });
  },
  // 在绑定元素的父组件卸载之后调用
  unmounted(el) {
    nodeList.delete(el);
  },
};

export default ClickOutside;