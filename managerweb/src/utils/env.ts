import type { GlobEnvConfig } from '/#/config';
import { warn } from '@/utils/log';
import pkg from '../../package.json';
import { getConfigFileName } from '../../build/getConfigFileName';

// 获取通用存储前缀
export function getCommonStoragePrefix() {
  const { VITE_GLOB_APP_SHORT_NAME } = getAppEnvConfig();
  return `${VITE_GLOB_APP_SHORT_NAME}__${getEnv()}`.toUpperCase();
}

// 根据版本生成缓存键
export function getStorageShortName() {
  return `${getCommonStoragePrefix()}${`__${pkg.version}`}__`.toUpperCase();
}

// 获取应用环境配置
export function getAppEnvConfig() {
  const ENV_NAME = getConfigFileName(import.meta.env);

  // 根据开发环境或生产环境获取全局配置
  const ENV = (import.meta.env.DEV
    ? (import.meta.env as unknown as GlobEnvConfig)
    : window[ENV_NAME as any]) as unknown as GlobEnvConfig;

  const {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,
    VITE_GLOB_FILE_URL,
    VITE_USE_MOCK,
    VITE_LOGGER_MOCK,
  } = ENV;

  // 验证 VITE_GLOB_APP_SHORT_NAME 是否只包含字母和下划线
  if (!/^[a-zA-Z\_]*$/.test(VITE_GLOB_APP_SHORT_NAME)) {
    warn(
      `VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`
    );
  }

  return {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,
    VITE_GLOB_FILE_URL,
    VITE_USE_MOCK,
    VITE_LOGGER_MOCK,
  };
}

/**
 * @description: 开发模式
 */
export const devMode = 'development';

/**
 * @description: 生产模式
 */
export const prodMode = 'production';

/**
 * @description: 获取环境变量
 * @returns: 当前环境模式
 */
export function getEnv(): string {
  return import.meta.env.MODE;
}

/**
 * @description: 是否为开发模式
 * @returns: 是否为开发模式的布尔值
 */
export function isDevMode(): boolean {
  return import.meta.env.DEV;
}

/**
 * @description: 是否为生产模式
 * @returns: 是否为生产模式的布尔值
 */
export function isProdMode(): boolean {
  return import.meta.env.PROD;
}