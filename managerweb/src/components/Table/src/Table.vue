<template>
    <div class="table-toolbar">
    <!-- 顶部工具栏 -->
      <div class="flex items-center table-toolbar-left">
        <!-- 表格标题区域 -->
        <template v-if="props.title">
          <div class="table-toolbar-left-title">
            {{ props.title }}
            <!-- 标题提示信息 -->
            <n-tooltip trigger="hover" v-if="props.titleTooltip">
              <template #trigger>
                <n-icon size="18" class="ml-1 text-gray-400 cursor-pointer">
                  <QuestionCircleOutlined />
                </n-icon>
              </template>
              {{ props.titleTooltip }}
            </n-tooltip>
          </div>
        </template>
      <!-- 自定义表格标题插槽 -->
        <slot name="tableTitle"></slot>
      </div>

    <!-- 顶部右侧工具栏 -->  
      <div class="flex items-center leading-none table-toolbar-right">
      <!-- 自定义工具栏插槽 -->
        <slot name="toolbar"></slot>
        <div class="button-group">
        <!--刷新按钮-->
        <n-button size="medium" color="#5bc0de"  type="primary" @click="reload">
          <span>刷新数据</span>
        </n-button>
        <!-- 分隔符 -->
        <n-divider vertical class="mx-4" />
        <!-- 导出按钮 -->
        <n-button size="medium" color="#3498db" type="primary" @click="exportFilteredData" :loading="isExporting">
          <template #icon>
          <n-icon>
            <DownloadOutlined />
          </n-icon>
        </template>
        导出数据
      </n-button>
      <n-divider vertical class="mx-4" />
      <!-- 导入按钮 -->
      <n-button size="medium" color="#36b37e" type="primary" @click="exportFilteredData" :loading="isExporting">
        <template #icon>
        <n-icon>
          <UploadOutlined />
        </n-icon>
        </template>
        导入数据
      </n-button>
      </div>
        <!--斑马纹-->
        <n-tooltip trigger="hover">
          <template #trigger>
            <div class="mr-2 table-toolbar-right-icon">
              <n-switch v-model:value="isStriped" @update:value="setStriped" />
            </div>
          </template>
          <span>表格斑马纹</span>
        </n-tooltip>
        <n-divider vertical />
  
      <!-- 刷新 -->
        <n-tooltip trigger="hover">
          <template #trigger>
            <div class="table-toolbar-right-icon" @click="reload">
              <n-icon size="18">
                <ReloadOutlined />
              </n-icon>
            </div>
          </template>
          <span>刷新</span>
        </n-tooltip>
      

      <!-- 表格密度设置 -->
        <n-tooltip trigger="hover">
          <template #trigger>
            <div class="table-toolbar-right-icon">
              <n-dropdown
                @select="densitySelect"
                trigger="click"
                :options="densityOptions"
                v-model:value="tableSize"
              >
                <n-icon size="18">
                  <ColumnHeightOutlined />
                </n-icon>
              </n-dropdown>
            </div>
          </template>
          <span>密度</span>
        </n-tooltip>
  
      <!-- 表格列设置组件 -->
        <ColumnSetting />
      </div>
    </div>
  <!-- 表格主体 -->
    <div class="s-table">
      <n-data-table
        ref="tableElRef"
        v-bind="getBindValues"
        :striped="isStriped"
        :pagination="pagination"
        @update:page="updatePage"
        @update:page-size="updatePageSize"
      >
        <template #[item]="data" v-for="item in Object.keys($slots)" :key="item">
          <slot :name="item" v-bind="data"></slot>
        </template>
      </n-data-table>
    </div>
  </template>
  
  <script lang="ts" setup>
    import { ref, unref, toRaw, computed, onMounted, nextTick } from 'vue';
    import { ReloadOutlined, ColumnHeightOutlined, QuestionCircleOutlined, DownloadOutlined, UploadOutlined } from '@vicons/antd';
    import { createTableContext } from './hooks/useTableContext';
  
    import  ColumnSetting  from '@/components/Table/src/components/settings/ColumnSetting.vue';
  
    import { useLoading } from './hooks/useloading';
    import { useColumns } from './hooks/useColumns';
    import { useDataSource } from './hooks/useDataSource';
    import { usePagination } from './hooks/usePagination';  
  
    import { basicProps } from './props';
  
    import { BasicTableProps } from './types/table';
    import type { DataTableInst } from 'naive-ui';
    import { getViewportOffset } from '@/utils/domUtils';
    import { useWindowSizeFn } from '@/hooks/event/useWindowSizeFn';
    import { isBoolean } from '@/utils/is';
    import { useTableExport } from './hooks/useTableExport';
    
    

    // 表格密度选项
  // 表格密度选项
  const densityOptions = [
    { type: 'menu', label: '紧凑', key: 'small' },
    { type: 'menu', label: '默认', key: 'medium' },
    { type: 'menu', label: '宽松', key: 'large' },
  ];
  // 定义组件事件
    const emit = defineEmits([
      'fetch-success',
      'fetch-error',
      'update:checked-row-keys',
      'edit-end',
      'edit-cancel',
      'edit-row-end',
      'edit-change',
    ]);
  
    // 定义组件属性
    const props = defineProps({ ...basicProps });
    // 定义设备高度
    const deviceHeight = ref(150);
    // 定义表格元素引用

    // 定义表格容器引用
    const wrapRef = ref<Nullable<HTMLDivElement>>(null);
    let paginationEl: HTMLElement | null;
    const isStriped = ref(props.striped || false);
    const tableData = ref<Recordable[]>([]);
    const innerPropsRef = ref<Partial<BasicTableProps>>();
    const tableElRef = ref<DataTableInst | null>(null);
    const { isExporting, exportCsv } = useTableExport(tableElRef);

    const exportAllData = () => exportCsv({ fileName: '全部数据' });
    const exportFilteredData = () => exportCsv({ fileName: '筛选数据', keepOriginalData: false });
  
    const getProps = computed(() => {
      return { ...props, ...unref(innerPropsRef) } as BasicTableProps;
    });
    // 定义表格大小
    const tableSize = ref(unref(getProps as any).size || 'medium');
    // 定义加载状态
    const { getLoading, setLoading } = useLoading(getProps);
  
    // 定义分页信息
    const { getPaginationInfo, setPagination } = usePagination(getProps);
    // 定义数据源
    const { getDataSourceRef, getDataSource, getRowKey, reload } = useDataSource(
      getProps,
      {
        getPaginationInfo,
        setPagination,
        tableData,
        setLoading,
      },
      emit
    );
  
    const { getPageColumns, setColumns, getColumns, getCacheColumns, setCacheColumnsField } =
      useColumns(getProps);
  
    //页码切换
    function updatePage(page) {
      setPagination({ page: page });
      reload();
    }
  
    //分页数量切换
    function updatePageSize(size) {
      setPagination({ page: 1, pageSize: size });
      reload();
    }
  
    //密度切换
    function densitySelect(e) {
      tableSize.value = e;
    }
  
    //获取表格大小
    const getTableSize = computed(() => tableSize.value);
  
    //组装表格信息
    const getBindValues = computed(() => {
      const tableData = unref(getDataSourceRef);
      const maxHeight = tableData.length ? `${unref(deviceHeight)}px` : 'auto';
      return {
        ...unref(getProps),
        loading: unref(getLoading),
        columns: toRaw(unref(getPageColumns)),
        rowKey: unref(getRowKey),
        data: tableData,
        size: unref(getTableSize),
        remote: true,
        'max-height': maxHeight,
        title: '', // 重置为空 避免绑定到 table 上面
      };
    });
  
    //获取分页信息
    const pagination = computed(() => toRaw(unref(getPaginationInfo)));
  
    function setProps(props: Partial<BasicTableProps>) {
      innerPropsRef.value = { ...unref(innerPropsRef), ...props };
    }
  
    const setStriped = (value: boolean) => (isStriped.value = value);
  
    const tableAction = {
      reload,
      setColumns,
      setLoading,
      setProps,
      getColumns,
      getDataSource,
      getPageColumns,
      getCacheColumns,
      setCacheColumnsField,
      emit,
    };
    // 定义是否可以调整大小
    const getCanResize = computed(() => {
      const { canResize } = unref(getProps);
      return canResize;
    });
    // 计算表格高度
  
    async function computeTableHeight() {
      const table = unref(tableElRef);
      if (!table) return;
      if (!unref(getCanResize)) return;
      const tableEl: any = table?.$el;
      const headEl = tableEl.querySelector('.n-data-table-thead .n-data-table-thead-tr');
      const { bottomIncludeBody } = getViewportOffset(headEl);
      const headerH = 64;
      let paginationH = 2;
      let marginH = 24;
      if (!isBoolean(unref(pagination))) {
        paginationEl = tableEl.querySelector('.n-data-table__pagination') as HTMLElement;
        if (paginationEl) {
          const offsetHeight = paginationEl.offsetHeight;
          paginationH += offsetHeight || 0;
        } else {
          paginationH += 28;
        }
      }
      let height =
        bottomIncludeBody - (headerH + paginationH + marginH + (props.resizeHeightOffset || 0));
      const maxHeight = props.maxHeight;
      height = maxHeight && maxHeight < height ? maxHeight : height;
      deviceHeight.value = height;
    }
    // 监听窗口大小变化
    useWindowSizeFn(computeTableHeight, 280);
  
    onMounted(() => {
      nextTick(() => {
        computeTableHeight();
      });
    });
  
    createTableContext({ ...tableAction, wrapRef, getBindValues });
  
    defineExpose(tableAction);
  </script>
  <style lang="less" scoped>
    .table-toolbar {
      display: flex;
      justify-content: space-between;
      padding: 0 0 16px 0;
  
      &-left {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex: 1;
  
        &-title {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          font-size: 16px;
          font-weight: 600;
        }
      }
  
      &-right {
        display: flex;
        justify-content: flex-end;
        flex: 1;
  
        &-icon {
          margin-left: 12px;
          font-size: 16px;
          cursor: pointer;
          color: var(--text-color);
  
          :hover {
            color: #1890ff;
          }
        }
      }
    }
  
    .table-toolbar-inner-popover-title {
      padding: 2px 0;
    }
    // 按钮组
    .button-group {
      display: flex;
      align-items: center;
      margin-right: 14px;
    }
    // 如果需要额外的间距调整，可以添加以下样式
    .n-divider.mx-4 {
      margin: 10px;  // 调整分隔线的左右边距
    }
  </style>
  
        