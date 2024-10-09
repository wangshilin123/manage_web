import type { InternalRowData, TableBaseColumn } from 'naive-ui/lib/data-table/src/interface';
import { ComponentType } from './componentType';

// 扩展 Naive UI 的 TableBaseColumn 接口，添加自定义属性
export interface BasicColumn<T = InternalRowData> extends TableBaseColumn<T> {
  // 是否可编辑
  edit?: boolean;
  // 是否可编辑整行
  editRow?: boolean;
  // 是否可编辑（可能是另一种编辑模式）
  editable?: boolean;
  // 编辑时使用的组件类型
  editComponent?: ComponentType;
  // 编辑组件的属性
  editComponentProps?: Recordable;
  // 编辑规则，可以是布尔值或自定义验证函数
  editRule?: boolean | ((text: string, record: Recordable) => Promise<string>);
  // 编辑值的映射函数
  editValueMap?: (value: any) => string;
  // 编辑行的回调函数
  onEditRow?: () => void;
  // 控制列显示的权限编码
  auth?: string[];
  // 控制列是否显示的业务逻辑
  ifShow?: boolean | ((column: BasicColumn) => boolean);
  // 是否支持拖拽，默认支持
  draggable?: boolean;
}

// 定义表格操作类型接口
export interface TableActionType {
  // 重新加载数据
  reload: (opt) => Promise<void>;
  // 触发事件（可选）
  emit?: any;
  // 获取列配置
  getColumns: (opt?) => BasicColumn[];
  // 设置列配置
  setColumns: (columns: BasicColumn[] | string[]) => void;
}

// 定义基本表格属性接口
export interface BasicTableProps {
  // 表格标题
  title?: string;
  // 数据源函数
  dataSource: Function;
  // 列配置
  columns: any[];
  // 分页配置
  pagination: object;
  // 是否显示分页
  showPagination: boolean;
  // 操作列配置
  actionColumn: any[];
  // 是否可以调整大小
  canResize: boolean;
  // 调整高度的偏移量
  resizeHeightOffset: number;
  // 加载状态
  loading: boolean;
} 