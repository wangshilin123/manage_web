import type { RouteLocationRaw, Router } from 'vue-router';
import { PageEnum } from '@/enums/pageEnum';
import { RedirectName } from '@/router/constant';
import { useRouter } from 'vue-router';
import { isString } from '@/utils/is';
import { unref } from 'vue';

// 扩展 RouteLocationRaw 类型，限制 path 只能是 PageEnum 中定义的值
export type RouteLocationRawEx = Omit<RouteLocationRaw, 'path'> & { path: PageEnum };

// 错误处理函数
function handleError(e: Error) {
  console.error(e);
}

/**
 * useGo hook: 用于页面跳转
 * @param _router 可选的 Router 实例
 * @returns 返回一个 go 函数，用于执行页面跳转
 */
export function useGo(_router?: Router) {
  let router;
  if (!_router) {
    router = useRouter();
  }
  const { push, replace } = _router || router;

  /**
   * 执行页面跳转
   * @param opt 跳转目标，可以是 PageEnum、RouteLocationRawEx 或字符串
   * @param isReplace 是否使用 replace 而不是 push 进行跳转
   */
  function go(opt: PageEnum | RouteLocationRawEx | string = PageEnum.BASE_HOME, isReplace = false) {
    if (!opt) {
      return;
    }
    if (isString(opt)) {
      // 如果 opt 是字符串，直接使用 push 或 replace
      isReplace ? replace(opt).catch(handleError) : push(opt).catch(handleError);
    } else {
      // 如果 opt 是对象，将其视为 RouteLocationRaw
      const o = opt as RouteLocationRaw;
      isReplace ? replace(o).catch(handleError) : push(o).catch(handleError);
    }
  }
  return go;
}

/**
 * useRedo hook: 用于重新加载当前页面
 * @param _router 可选的 Router 实例
 * @returns 返回一个 redo 函数，用于重新加载当前页面
 */
export const useRedo = (_router?: Router) => {
  const { push, currentRoute } = _router || useRouter();
  const { query, params = {}, name, fullPath } = unref(currentRoute.value);

  /**
   * 重新加载当前页面
   * @returns Promise<boolean> 表示重新加载是否成功
   */
  function redo(): Promise<boolean> {
    return new Promise((resolve) => {
      if (name === RedirectName) {
        // 如果当前页面已经是重定向页面，则不进行操作
        resolve(false);
        return;
      }
      if (name && Object.keys(params).length > 0) {
        // 如果路由有名称且有参数，使用命名路由方式重定向
        params['_redirect_type'] = 'name';
        params['path'] = String(name);
      } else {
        // 否则使用路径方式重定向
        params['_redirect_type'] = 'path';
        params['path'] = fullPath;
      }
      // 跳转到重定向页面，携带当前页面的信息
      push({ name: RedirectName, params, query }).then(() => resolve(true));
    });
  }
  return redo;
};