import type { PropType } from 'vue';
import { propTypes } from '@/utils/propTypes';
import { BasicColumn } from './types/table';
import { NDataTable } from 'naive-ui';

export const basicProps = {
  ...NDataTable.props, // 继承 Naive UI 的 DataTable 组件的所有 props

  // 表格标题
  title: {
    type: String,
    default: null,
  },

  // 表格标题的提示信息
  titleTooltip: {
    type: String,
    default: null,
  },

  // 表格尺寸
  size: {
    type: String,
    default: 'medium',
  },

  // 数据源
  dataSource: {
    type: [Object],
    default: () => [],
  },

  // 表格列配置
  columns: {
    type: [Array] as PropType<BasicColumn[]>,
    default: () => [],
    
    required: true,
  },

  // 请求之前的钩子函数
  beforeRequest: {
    type: Function as PropType<(...arg: any[]) => void | Promise<any>>,
    default: null,
  },

  // 数据请求函数
  request: {
    type: Function as PropType<(...arg: any[]) => Promise<any>>,
    default: null,
  },

  // 请求之后的钩子函数
  afterRequest: {
    type: Function as PropType<(...arg: any[]) => void | Promise<any>>,
    default: null,
  },

  // 行数据的唯一键
  rowKey: {
    type: [String, Function] as PropType<string | ((record) => string)>,
    default: undefined,
  },

  // 分页配置
  pagination: {
    type: [Object, Boolean],
    default: () => {},
  },

  // 是否显示分页（已废弃）
  showPagination: {
    type: [String, Boolean],
    default: 'auto',
  },

  // 操作列配置
  actionColumn: {
    type: Object as PropType<BasicColumn>,
    default: null,
  },

  // 是否可以调整表格大小
  canResize: propTypes.bool.def(true),

  // 调整高度的偏移量
  resizeHeightOffset: propTypes.number.def(0),

  // 是否显示斑马纹
  striped: propTypes.bool.def(false),
};
