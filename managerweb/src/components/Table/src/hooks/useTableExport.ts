import { ref, Ref } from 'vue';
import type { DataTableInst } from 'naive-ui';


/**
 * 提供表格导出功能的组合式函数
 * 
 * @param {Ref<DataTableInst | null>} tableRef - 表格组件的引用
 * @returns {Object} 包含导出状态和导出方法的对象
 */
export function useTableExport(tableRef: Ref<DataTableInst | null>) {
  // 用于跟踪导出状态的响应式引用
  const isExporting = ref(false);

  /**
   * 导出表格数据为CSV文件
   * 
   * @param {Object} options - 导出选项
   * @param {string} [options.fileName='table-data'] - 导出文件的名称（不包含日期和扩展名）
   * @param {boolean} [options.keepOriginalData=true] - 是否保留原始数据（false 表示只导出筛选后的数据）
   * @returns {Promise<void>}
   */
  const exportCsv = async (options: {
    fileName?: string;
    keepOriginalData?: boolean;
  } = {}) => {
    // 检查表格引用是否可用
    if (!tableRef.value) {
      console.error('Table reference is not available');
      return;
    }

    // 解构并设置默认值
    const { fileName = 'table-data', keepOriginalData = true } = options;

    try {
      // 设置导出状态为 true
      isExporting.value = true;

      // 调用表格组件的 downloadCsv 方法
      await tableRef.value.downloadCsv({
        // 文件名格式：{fileName}-YYYY-MM-DD.csv
        fileName: `${fileName}-${new Date().toISOString().split('T')[0]}.csv`,
        keepOriginalData
      });
    } catch (error) {
      // 错误处理
      console.error('Error exporting CSV:', error);
    } finally {
      // 无论成功与否，最后都将导出状态设置为 false
      isExporting.value = false;
    }
  };

  // 返回导出状态和导出方法
  return {
    isExporting,
    exportCsv
  };
}