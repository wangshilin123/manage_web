import  alovaInstance  from '@/utils/http/alova/index';

//获取table
export function getTableList(params) {
  return alovaInstance.Get('/table/list', { params });
}
