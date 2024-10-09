import type { RouteRecordRaw } from 'vue-router';
import { isNavigationFailure, Router } from 'vue-router';
import { useUser } from '@/store/modules/user';
import { useAsyncRoute } from '@/store/modules/asyncroute';
import { ACCESS_TOKEN } from '@/store/mutation-types';
import { storage } from '@/utils/Storage';
import { PageEnum } from '@/enums/pageEnum';
import { ErrorPageRoute } from '@/router/base';

// 定义登录页面的路径常量
const LOGIN_PATH = PageEnum.BASE_LOGIN;

// 定义白名单路径，这些路径可以直接访问而不需要权限
const whitePathList = [LOGIN_PATH];

export function createRouterGuards(router: Router) {
  // 获取用户和异步路由的 store
  const userStore = useUser();
  const asyncRouteStore = useAsyncRoute();

  // 定义全局前置守卫
  router.beforeEach(async (to, from, next) => {
    // 开始加载动画（如果存在）
    // 作用：提供视觉反馈，表明路由跳转正在进行
    const Loading = window['$loading'] || null;
    Loading && Loading.start();

    // 处理从登录页面到错误页面的特殊情况
    // 作用：防止用户在登录后直接跳转到错误页面
    if (from.path === LOGIN_PATH && to.name === 'errorPage') {
      next(PageEnum.BASE_HOME);
      return;
    }

    // 如果目标路径在白名单中，直接允许访问
    // 作用：允许某些页面（如登录页）无需权限即可访问
    if (whitePathList.includes(to.path as PageEnum)) {
      next();
      return;
    }

    // 获取访问令牌
    const token = storage.get(ACCESS_TOKEN);

    // 如果没有令牌
    if (!token) {
      // 检查路由是否设置了忽略认证
      // 作用：允许某些路由即使在未登录状态下也可以访问
      if (to.meta.ignoreAuth) {
        next();
        return;
      }
      // 否则重定向到登录页面
      // 作用：强制用户登录后才能访问受保护的路由
      const redirectData: { path: string; replace: boolean; query?: Recordable<string> } = {
        path: LOGIN_PATH,
        replace: true,
      };
      if (to.path) {
        redirectData.query = {
          ...redirectData.query,
          redirect: to.path,
        };
      }
      next(redirectData);
      return;
    }

    // 如果动态路由已经添加，直接进入下一个路由
    // 作用：避免重复添加动态路由，提高效率
    if (asyncRouteStore.getIsDynamicRouteAdded) {
      next();
      return;
    }

    // 获取用户信息
    // 作用：获取用户的权限信息，用于生成动态路由
    const userInfo = await userStore.getInfo();

    // 生成路由
    // 作用：根据用户权限动态生成可访问的路由
    const routes = await asyncRouteStore.generateRoutes(userInfo);

    // 动态添加可访问路由表
    // 作用：将生成的动态路由添加到路由器中
    routes.forEach((item) => {
      router.addRoute(item as unknown as RouteRecordRaw);
    });

    // 添加404路由
    // 作用：确保在所有路由之后有一个捕获所有未匹配路由的错误页面
    const isErrorPage = router.getRoutes().findIndex((item) => item.name === ErrorPageRoute.name);
    if (isErrorPage === -1) {
      router.addRoute(ErrorPageRoute as unknown as RouteRecordRaw);
    }

    // 处理重定向
    // 作用：确保用户被重定向到正确的页面，特别是在登录后
    const redirectPath = (from.query.redirect || to.path) as string;
    const redirect = decodeURIComponent(redirectPath);
    const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect };
    
    // 设置动态路由已添加的标志
    // 作用：防止重复添加动态路由
    asyncRouteStore.setDynamicRouteAdded(true);
    
    // 进入下一个路由
    next(nextData);
    
    // 结束加载动画
    Loading && Loading.finish();
  });

  // 定义全局后置钩子
  router.afterEach((to, _, failure) => {
    // 设置页面标题
    // 作用：根据路由的元信息更新页面标题
    document.title = (to?.meta?.title as string) || document.title;
    
    // 处理导航失败
    // 作用：可以在这里添加导航失败的处理逻辑
    if (isNavigationFailure(failure)) {
      //console.log('failed navigation', failure)
    }

    // 处理需要缓存的组件
    // 作用：管理需要被 keep-alive 缓存的组件
    const asyncRouteStore = useAsyncRoute();
    const keepAliveComponents = asyncRouteStore.keepAliveComponents;
    const currentComName: any = to.matched.find((item) => item.name == to.name)?.name;
    
    if (currentComName && !keepAliveComponents.includes(currentComName) && to.meta?.keepAlive) {
      // 需要缓存的组件
      keepAliveComponents.push(currentComName);
    } else if (!to.meta?.keepAlive || to.name == 'Redirect') {
      // 不需要缓存的组件
      const index = asyncRouteStore.keepAliveComponents.findIndex((name) => name == currentComName);
      if (index != -1) {
        keepAliveComponents.splice(index, 1);
      }
    }
    
    // 更新需要缓存的组件列表
    asyncRouteStore.setKeepAliveComponents(keepAliveComponents);
    
    // 结束加载动画
    const Loading = window['$loading'] || null;
    Loading && Loading.finish();
  });

  // 处理路由错误
  // 作用：可以在这里添加全局的路由错误处理逻辑
  router.onError((error) => {
    console.log(error, '路由错误');
  });
}