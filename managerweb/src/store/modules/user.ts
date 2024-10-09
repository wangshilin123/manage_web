import { defineStore } from 'pinia'
import { storage } from '@/utils/Storage';
import { store } from '@/store';
import { ACCESS_TOKEN, CURRENT_USER } from '@/store/mutation-types';
import { login, getUserInfo } from '@/api/system/user';
import { ResultEnum } from '@/enums/httpEnum';

// 定义用户信息类型
export interface UserInfoType {
    name: string;
    email: string;
    avatar: string;
    roles: string[];
    permissions: string[];
}

// 定义用户状态类型
export interface UserState {
    token: string;
    username: string;
    welcome: string;
    avatar: string;
    permissions: any[];
    info: UserInfoType;
}

// 使用 Pinia 定义用户 store
export const useUserStore = defineStore({
    id: 'login_user', // store 的唯一 ID
    // 定义 store 的初始状态
    state: (): UserState => ({ 
        token: storage.get(ACCESS_TOKEN, ''), // 从本地存储获取 token，如果不存在则为空字符串
        username: '',
        welcome: '',
        avatar: '',
        permissions: [],
        info: storage.get(CURRENT_USER, {}), // 从本地存储获取用户信息，如果不存在则为空对象
    }),
    // 定义 getters，用于获取状态
    getters: {
        getToken(): string {
            return this.token;
        },
        getAvatar(): string {
            return this.avatar;
        },
        getNickname(): string {
            return this.username;
        },
        getPermissions(): [any][] {
            return this.permissions;
        },
        getUserInfo(): UserInfoType {
            return this.info;
        },
    },
    // 定义 actions，用于修改状态
    actions: {
        // 设置 token
        setToken(token: string) {
            this.token = token;
        },
        // 设置头像
        setAvatar(avatar: string) {
            this.avatar = avatar;
        },
        // 设置权限
        setPermissions(permissions) {
            this.permissions = permissions;
        },
        // 设置用户信息
        setUserInfo(info: UserInfoType) {
            this.info = info;
        },
        // 登录操作
        async login(params: any) {
            const response = await login(params); // 调用登录 API
            const { result, code } = response;
            if (code === ResultEnum.SUCCESS) {
                const ex = 1 * 24 * 60 * 60; // 设置过期时间为 1 天
                storage.set(ACCESS_TOKEN, result.token, ex); // 将 token 存储到本地
                storage.set(CURRENT_USER, result, ex); // 将用户信息存储到本地
                this.setToken(result.token); // 更新 store 中的 token
                this.setUserInfo(result); // 更新 store 中的用户信息
            }
            return response;
        },
        // 获取用户信息
        async getInfo() {
          const data = await getUserInfo();
          console.log("data",data)
          const { result } = data;
          if (result.permissions && result.permissions.length) {
            const permissionsList = result.permissions;
            this.setPermissions(permissionsList);
            this.setUserInfo(result);
          } else {
            throw new Error('getInfo: permissionsList must be a non-null array !');
          }
          this.setAvatar(result.avatar);
          return result;
        },
        // 登出操作
        async logout() {
            this.setPermissions([]); // 清空权限
            this.setUserInfo({ username: '', email: '' }); // 重置用户信息
            storage.remove(ACCESS_TOKEN); // 从本地存储中移除 token
            storage.remove(CURRENT_USER); // 从本地存储中移除用户信息
        },
    },       
});

// 导出一个函数，用于在组件中使用 UserStore
export function useUser() {
    return useUserStore(store);
}