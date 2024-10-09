import { createApp } from 'vue'
import './styles/tailwind.css';
import { createPinia } from 'pinia'
import App from './App.vue'
import router, { setupRouter } from './router';
import { setupNaive } from '@/plugins';
import Antd from 'ant-design-vue'
import { setupStore } from '@/store';
import { Form,Button, message,Input } from 'ant-design-vue';

async function bootstrap() {
    const app = createApp(App);
    // 挂载状态管理
    setupStore(app);
    const pinia = createPinia()
    setupNaive(app);
    setupRouter(app);
    app.use(Button);
    app.use(Input);
    app.use(pinia);
    app.use(Antd);
    app.mount('#app', true);
}
void bootstrap();