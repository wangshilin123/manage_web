import { toRaw, unref } from 'vue';
import { defineStore } from 'pinia';
import { RouteRecordRaw } from 'vue-router';
import { store } from '@/store';
import { asyncRoutes, constantRouter } from '@/router/index';
import { nextTick } from 'vue';
import { useProjectSetting } from '@/hooks/setting/useprojectsetting';

interface TreeHelperConfig {
  id: string;
  children: string;
  pid: string;
}

const DEFAULT_CONFIG: TreeHelperConfig = {
  id: 'id',
  children: 'children',
  pid: 'pid',
};

const getConfig = (config: Partial<TreeHelperConfig>) => Object.assign({}, DEFAULT_CONFIG, config);

export interface IAsyncRouteState {
  menus: RouteRecordRaw[];
  routers: any[];
  routersAdded: any[];
  keepAliveComponents: string[];
  isDynamicRouteAdded: boolean;
}

function filter<T = any>(
  tree: T[],
  func: (n: T) => boolean,
  config: Partial<TreeHelperConfig> = {}
): T[] {
  config = getConfig(config);
  const children = config.children as string;

  function listFilter(list: T[]) {
    return list
      .map((node: any) => ({ ...node }))
      .filter((node) => {
        node[children] = node[children] && listFilter(node[children]);
        return func(node) || (node[children] && node[children].length);
      });
  }

  return listFilter(tree);
}

export const useAsyncRouteStore = defineStore({
    id: 'app-async-route',
    state: (): IAsyncRouteState => ({
      menus: [],
      routers: constantRouter,
      routersAdded: [],
      keepAliveComponents: [],
      isDynamicRouteAdded: false,
    }),
  getters: {
    getMenus(): RouteRecordRaw[] {
      console.log('Getting menus:', this.menus); // 添加日志
      console.log('getMenus called', new Error().stack);
      return this.menus;
    },
    getIsDynamicRouteAdded(): boolean {
      return this.isDynamicRouteAdded;
    },
  },
  actions: {
    getRouters() {
      return toRaw(this.routersAdded);
    },
    setDynamicRouteAdded(added: boolean) {
      this.isDynamicRouteAdded = added;
    },
    // 设置动态路由
    setRouters(routers: RouteRecordRaw[]) {
      this.routersAdded = routers;
      this.routers = constantRouter.concat(routers);
    },
    setMenus(menus: RouteRecordRaw[]) {
      // 设置动态路由
      console.log('Setting menus:', menus); // 添加日志
      this.menus = menus;
      nextTick(() => {
        console.log('Menus in next tick:', this.getMenus);
      });
    },
    setKeepAliveComponents(compNames: string[]) {
      // 设置需要缓存的组件
      this.keepAliveComponents = compNames;
    },
    logMenuChange(source: string) {
      console.log(`Menu changed from ${source}:`, JSON.stringify(this.menus));
    },

    async generateRoutes(data) {
      // 用于存储过滤后的路由
      let accessedRouters;
    
      // 从传入的数据中获取权限列表，如果不存在则使用空数组
      const permissionsList = data.permissions ?? [];
    
      // 定义路由过滤函数
      const routeFilter = (route) => {
        // 获取路由的 meta 信息
        const { meta } = route;
        // 从 meta 中获取权限信息
        const { permissions } = meta || {};
    
        // 如果路由没有定义权限，则所有用户都可以访问
        if (!permissions) return true;
    
        // 检查用户的权限列表是否包含路由所需的任一权限
        return permissionsList.some((item) => permissions.includes(item.value));
      };
    
      try {
        // 使用 filter 函数过滤异步路由
        // 这里直接处理静态定义的异步路由，而不是从后端动态获取
        accessedRouters = filter(asyncRoutes, routeFilter);
      } catch (error) {
        // 如果过滤过程中出现错误，记录到控制台
        console.log(error);
      }
    
      // 再次过滤路由，确保所有子路由也满足权限要求
      accessedRouters = accessedRouters.filter(routeFilter);
      // 更新 store 中的路由信息
      this.setRouters(accessedRouters);
      // 更新 store 中的菜单信息
      this.setMenus(accessedRouters);
    
      // 返回过滤后的路由，使用 toRaw 确保返回原始对象而非响应式对象
      return toRaw(accessedRouters);
    },
    },
});

// Need to be used outside the setup
export function useAsyncRoute() {
  return useAsyncRouteStore(store);
}
