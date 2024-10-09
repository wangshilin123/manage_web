<template>
  <div id="app">
    <n-config-provider>
    <n-message-provider>
      <n-dialog-provider>
    <router-view />
    </n-dialog-provider>
    </n-message-provider>
    </n-config-provider>
  </div>
</template>

<script>
import {  NConfigProvider, NMessageProvider, NDialogProvider } from 'naive-ui'
export default {
  name: 'App',
};
</script>

<style>
/* 全局样式 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}

/* 移除默认的 margin 和 padding */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* 确保所有页面都能占满高度 */
.full-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>