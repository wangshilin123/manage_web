import { upperFirst } from 'lodash-es';

// 定义视口偏移结果接口
export interface ViewportOffsetResult {
  left: number;
  top: number;
  right: number;
  bottom: number;
  rightIncludeBody: number;
  bottomIncludeBody: number;
}

// 获取元素的边界客户端矩形
export function getBoundingClientRect(element: Element): DOMRect | number {
  if (!element || !element.getBoundingClientRect) {
    return 0;
  }
  return element.getBoundingClientRect();
}

// 去除字符串两端的空白字符
function trim(string: string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
}

// 检查元素是否包含指定的类名
export function hasClass(el: Element, cls: string) {
  if (!el || !cls) return false;
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }
}

// 为元素添加类名
export function addClass(el: Element, cls: string) {
  if (!el) return;
  let curClass = el.className;
  const classes = (cls || '').split(' ');

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else if (!hasClass(el, clsName)) {
      curClass += ' ' + clsName;
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
}

// 从元素中移除类名
export function removeClass(el: Element, cls: string) {
  if (!el || !cls) return;
  const classes = cls.split(' ');
  let curClass = ' ' + el.className + ' ';

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.remove(clsName);
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(' ' + clsName + ' ', ' ');
    }
  }
  if (!el.classList) {
    el.className = trim(curClass);
  }
}

/**
 * 获取当前元素的左侧和顶部偏移量
 * left: 元素最左侧到文档左侧的距离
 * top: 元素顶部到文档顶部的距离
 * right: 元素最右侧到文档右侧的距离
 * bottom: 元素底部到文档底部的距离
 * rightIncludeBody: 元素最左侧到文档右侧的距离
 * bottomIncludeBody: 元素底部到文档底部的距离
 */
export function getViewportOffset(element: Element): ViewportOffsetResult {
  const doc = document.documentElement;

  const docScrollLeft = doc.scrollLeft;
  const docScrollTop = doc.scrollTop;
  const docClientLeft = doc.clientLeft;
  const docClientTop = doc.clientTop;

  const scrollX = window.scrollX;
  const scrollY = window.scrollY;

  const box = getBoundingClientRect(element);

  const { left: retLeft, top: rectTop, width: rectWidth, height: rectHeight } = box as DOMRect;

  const scrollLeft = (scrollX || docScrollLeft) - (docClientLeft || 0);
  const scrollTop = (scrollY || docScrollTop) - (docClientTop || 0);
  const offsetLeft = retLeft + scrollX;
  const offsetTop = rectTop + scrollY;

  const left = offsetLeft - scrollLeft;
  const top = offsetTop - scrollTop;

  const clientWidth = window.document.documentElement.clientWidth;
  const clientHeight = window.document.documentElement.clientHeight;
  return {
    left: left,
    top: top,
    right: clientWidth - rectWidth - left,
    bottom: clientHeight - rectHeight - top,
    rightIncludeBody: clientWidth - left,
    bottomIncludeBody: clientHeight - top,
  };
}

// 生成带有浏览器前缀的 CSS 属性对象
export function hackCss(attr: string, value: string) {
  const prefix: string[] = ['webkit', 'Moz', 'ms', 'OT'];

  const styleObj: any = {};
  prefix.forEach((item) => {
    styleObj[`${item}${upperFirst(attr)}`] = value;
  });
  return {
    ...styleObj,
    [attr]: value,
  };
}

// 为元素添加事件监听器
export function on(
  element: Element | HTMLElement | Document | Window,
  event: string,
  handler: EventListenerOrEventListenerObject
): void {
  if (element && event && handler) {
    element.addEventListener(event, handler, false);
  }
}

// 从元素移除事件监听器
export function off(
  element: Element | HTMLElement | Document | Window,
  event: string,
  handler: Fn
): void {
  if (element && event && handler) {
    element.removeEventListener(event, handler, false);
  }
}

// 为元素添加一次性事件监听器
export function once(el: HTMLElement, event: string, fn: EventListener): void {
  const listener = function (this: any, ...args: unknown[]) {
    if (fn) {
      fn.apply(this, args);
    }
    off(el, event, listener);
  };
  on(el, event, listener);
}