// 定义一个通用函数类型 Fn
// T 是参数类型（默认为 any），R 是返回值类型（默认为 T）
declare interface Fn<T = any, R = T> {
    (...arg: T[]): R;
}

// 定义一个返回 Promise 的函数类型 PromiseFn
// T 是参数类型（默认为 any），R 是 Promise 解析的类型（默认为 T）
declare interface PromiseFn<T = any, R = T> {
    (...arg: T[]): Promise<R>;
}

// 定义一个可能为 null 的类型 RefType
declare type RefType<T> = T | null;

// 定义一个选项数组类型 LabelValueOptions
// 每个选项包含 label, value, disabled 属性，并允许其他任意字符串键的属性
declare type LabelValueOptions = {
    label: string;
    value: any;
    disabled: boolean;
    [key: string]: string | number | boolean;
}[];

// 定义一个 emit 函数类型 EmitType
// 用于组件事件发射
declare type EmitType = (event: string, ...args: any[]) => void;

// 定义目标上下文类型 TargetContext
// 用于指定链接打开方式
declare type TargetContext = '_self' | '_blank';

// 定义一个组件元素引用接口 ComponentElRef
// T 继承自 HTMLElement，默认为 HTMLDivElement
declare interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
    $el: T;
}

// 定义一个可能为 null 的组件引用类型 ComponentRef
declare type ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null;

// 定义一个可能为 null 的元素引用类型 ElRef
declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;

// 定义一个可能为 null 的类型 Nullable
declare type Nullable<T> = T | null;

// 定义一个可能为任何类型的记录类型 Recordable
declare type Recordable<T = any> = Record<string, T>;

// 定义 JSX 命名空间
namespace JSX {
    // tslint:disable no-empty-interface
    type Element = VNode;
    // tslint:disable no-empty-interface
    type ElementClass = ComponentRenderProxy;

    interface ElementAttributesProperty {
      $props: any;
    }

    interface IntrinsicElements {
      [elem: string]: any;
    }

    interface IntrinsicAttributes {
      [elem: string]: any;
    }
  }