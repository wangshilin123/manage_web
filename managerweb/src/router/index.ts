import { App } from 'vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Login from '@/views/login/index.vue'; // 登录页面组件
import { PageEnum } from '@/enums/pageEnum'
import type { IModuleType } from './types';
import { createRouterGuards } from './guards';

const modules = import.meta.glob<IModuleType>('./modules/**/*.ts', { eager: true });

const routeModuleList: RouteRecordRaw[] = Object.keys(modules).reduce((list, key) => {
  const mod = modules[key].default ?? {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  return [...list, ...modList];
}, []);

export const RootRoute: RouteRecordRaw = {
  path: '/index',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
};

export const LoginRoute: RouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/login/index.vue'),
  meta: {
    title: '登录',
  },
};

//需要验证权限
export const asyncRoutes = [...routeModuleList];


export const constantRouter: RouteRecordRaw[] = [LoginRoute, RootRoute,];
const router = createRouter({
  history: createWebHistory(),
  routes: constantRouter,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

export function setupRouter(app: App) {
  app.use(router);
  // 创建路由守卫
  createRouterGuards(router);
}


// 导出路由实例
export default router;