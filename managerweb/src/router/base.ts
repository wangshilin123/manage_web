import { ErrorPage, RedirectName, Layout } from '@/router/constant';
import { RouteRecordRaw } from 'vue-router';

// 404 错误页面路由
export const ErrorPageRoute: RouteRecordRaw = {
  path: '/:path(.*)*',  // 匹配所有未定义的路由
  name: 'ErrorPage',
  component: Layout,  // 使用主布局组件
  meta: {
    title: 'ErrorPage',
    hideBreadcrumb: true,  // 隐藏面包屑导航
  },
  children: [
    {
      path: '/:path(.*)*',  // 嵌套路由，再次匹配所有路径
      name: 'ErrorPageSon',
      component: ErrorPage,  // 使用错误页面组件
      meta: {
        title: 'ErrorPage',
        hideBreadcrumb: true,
      },
    },
  ],
};

// 重定向路由
export const RedirectRoute: RouteRecordRaw = {
  path: '/redirect',
  name: RedirectName,
  component: Layout,  // 使用主布局组件
  meta: {
    title: RedirectName,
    hideBreadcrumb: true,
  },
  children: [
    {
      path: '/redirect/:path(.*)',  // 动态路径参数，匹配所有重定向路径
      name: RedirectName,
      component: () => import('@/views/redirect/index.vue'),  // 动态导入重定向组件
      meta: {
        title: RedirectName,
        hideBreadcrumb: true,
      },
    },
  ],
};