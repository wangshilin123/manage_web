import { createAlova } from 'alova';
import adapterFetch from 'alova/fetch';
import VueHook from 'alova/vue';
import { useUser } from '@/store/modules/user';
import { storage } from '@/utils/Storage';
import { ResultEnum } from '@/enums/httpEnum';
import { createAlovaMockAdapter } from '@alova/mock';
import mocks from './mocks';

// 创建 mock 适配器
const mockAdapter = createAlovaMockAdapter([...mocks], {
  // 全局控制是否启用mock接口，默认为true
  enable: true,

  // 非模拟请求适配器，用于未匹配mock接口时发送请求
  httpAdapter: adapterFetch(),

  // mock接口响应延迟，单位毫秒
  delay: 1000,

  // 自定义打印mock接口请求信息
  mockRequestLogger: console.log,
  
  onMockError(error, currentMethod) {
    console.error('🚀 ~ onMockError ~ currentMethod:', currentMethod);
    console.error('🚀 ~ onMockError ~ error:', error);
  },
});

// 创建 alova 实例
const alovaInstance = createAlova({
  // 基础地址
  baseURL: 'http://localhost:5173/api',

  // 使用 VueHook 进行状态管理
  statesHook: VueHook,

  // 请求适配器，这里使用 mockAdapter
  requestAdapter: mockAdapter,

  // 全局的请求拦截器
  beforeRequest: (method) => {
    const { token } = useUser();
    if (token) {
      method.config.headers['Authorization'] = `Bearer ${token}`;
    }
  },
  
  // 全局的响应拦截器
  responded: {
    onSuccess: async (response) => {
      const json = await response.json();
      if (json.code === ResultEnum.SUCCESS) {
        console.log('json.data', json)
        return json;
      } else {
        throw new Error(json.message || 'Request failed');
      }
    },
    onError: (err) => {
      console.error('Request error:', err);
      throw err;
    }
  },

  // 缓存配置
//  cacheStorage: storage,
});

// 导出 alova 实例
export default  alovaInstance;

// 导出一个用于创建请求方法的函数
export const createRequest = (method: string, url: string, config: any = {}) => {
  return alovaInstance[method](url, config);
};