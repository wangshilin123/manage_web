<template>
    <!-- 使用 n-spin 组件显示加载状态 -->
    <n-spin :show="loading">
      <div class="frame">
        <!-- iframe 用于嵌入外部页面 -->
        <iframe :src="frameSrc" class="frame-iframe" ref="frameRef"></iframe>
      </div>
    </n-spin>
  </template>
  
  <script lang="ts" setup>
    import { ref, unref, onMounted, nextTick } from 'vue';
    import { useRoute } from 'vue-router';
  
    // 获取当前路由信息
    const currentRoute = useRoute();
    // 控制加载状态的响应式变量
    const loading = ref(false);
    // iframe 元素的引用
    const frameRef = ref<HTMLFrameElement | null>(null);
    // iframe 的 src 属性
    const frameSrc = ref<string>('');
  
    // 从路由元信息中获取 frameSrc
    if (unref(currentRoute.meta)?.frameSrc) {
      frameSrc.value = unref(currentRoute.meta)?.frameSrc as string;
    }
  
    // 隐藏加载状态
    function hideLoading() {
      loading.value = false;
    }
  
    // 初始化 iframe 加载事件
    function init() {
      nextTick(() => {
        const iframe = unref(frameRef);
        if (!iframe) return;
        const _frame = iframe as any;
        // 兼容 IE 的事件绑定
        if (_frame.attachEvent) {
          _frame.attachEvent('onload', () => {
            hideLoading();
          });
        } else {
          // 现代浏览器的事件绑定
          iframe.onload = () => {
            hideLoading();
          };
        }
      });
    }
  
    // 组件挂载时执行
    onMounted(() => {
      loading.value = true;
      init();
    });
  </script>
  
  <style lang="less" scoped>
    .frame {
      width: 100%;
      height: 100vh;
  
      &-iframe {
        width: 100%;
        height: 100%;
        overflow: hidden;
        border: 0;
        box-sizing: border-box;
      }
    }
  </style>