import Vue from 'vue'
import App from './App'

import router from './router'
import store from './store'

// 导入 ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import axios from 'axios'
Vue.prototype.axios = axios;

import Vuex from 'vuex';

Vue.use(ElementUI);
Vue.use(Vuex);

router.beforeEach((to,from,next) => {
  // 获取用户登录状态
  let isLogin = sessionStorage.getItem("isLogin");

  // 注销
  if(to.path == '/logout'){
    // 清空
    sessionStorage.clear();
    // 跳转到登录
    next({path:'/login'});
  }
  // 如果请求的是登录页，发现已经登录了，到主页
   if(to.path == '/login') {
    if(isLogin != null){
      // 跳转到首页
      next({path:'/main'});
    }
  }
  else if(isLogin == null){
    // 跳转到登录页
    next({path:'/login'})
  }

  // 默认下一个路由
  next();

});

new Vue({
  el: '#app',
  // 启用路由
  router,store,
  // 启用 ElementUI
  render: h => h(App)
});
