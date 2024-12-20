import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import { createRouter, createWebHistory ,createWebHashHistory} from 'vue-router';

const routes = [
    { path: '/Home', component: App }
  ];
  
  const router = createRouter({
    history: createWebHashHistory(), 
    routes, // 路由配置
  });


createApp(App).use(router).use(ElementPlus).mount('#app')
