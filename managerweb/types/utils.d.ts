import type { ComputedRef, Ref } from 'vue';

// 动态属性类型
export type DynamicProps<T> = {
  [P in keyof T]: Ref<T[P]> | T[P] | ComputedRef<T[P]>;
};
