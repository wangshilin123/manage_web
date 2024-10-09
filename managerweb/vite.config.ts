import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import { viteMockServe } from 'vite-plugin-mock'

function pathResolve(dir: string) {
  return resolve(process.cwd(), dir);
}

export default defineConfig({
  plugins: [vue(),
    viteMockServe({
      mockPath: 'mock',
      enable: true,
    }),

  ], // 使用 Vue 插件
  resolve: {
    alias: [
      { find: '@', replacement: pathResolve('src') + '/' },
      { find: 'types', replacement: pathResolve('types') + '/' },
    ],
  },
});