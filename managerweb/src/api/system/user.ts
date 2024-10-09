// 导入 Alova 实例和创建请求的函数
import alovaInstance, { createRequest } from '@/utils/http/alova/index';

// 定义响应结果的接口，如果有具体的结构可以在这里定义
interface InResult<T = any> {
// 根据实际返回数据结构定义属性
  code: number;
  message: string;
  result: T;
}

/**
 * 获取用户信息
 * @description 获取当前登录用户的详细信息，包括权限等
 * @returns Promise<InResult> 返回一个 Promise，解析为用户信息
 */
export function getUserInfo() {
  return alovaInstance.Get<InResult>('/admin_info', {
    meta: {
      isReturnNativeResponse: true, // 返回原始响应，而不是经过处理的数据
    },
  });
}

/**
 * 用户登录
 * @description 发送登录请求
 * @param params 登录参数，包含用户名和密码
 * @returns Promise<InResult> 返回一个 Promise，解析为登录请求的结果
 */
export function login(params: { username: string; password: string }) {
  return alovaInstance.Post<InResult>(
    '/login',
    { params },
    {
      meta: {
        isReturnNativeResponse: true, // 返回原始响应，而不是经过处理的数据
      },
    }
  );
}

/**
 * 用户登出
 * @description 发送登出请求
 * @param params 可选的登出参数
 * @returns Promise<void> 返回一个 Promise，表示登出操作完成
 */
export function logout(params?: Record<string, any>) {
  return alovaInstance.Post<void>('/login/logout', { params });
}