import Vue from 'vue'
// 导入路由组件
import Router from 'vue-router'
// 导入自定义页面组件
import Content from '@/components/Content'

// 安装路由组件
Vue.use(Router);

// 配置路由
export default new Router({
    routes : [
        {
            // 路由路径
            path : '/content',
            // 路由名称
            name : 'Content',
            // 跳转到组件
            component : Content
        }
    ]
})
