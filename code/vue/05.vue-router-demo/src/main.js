// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import router from './router'

new Vue({
  el: '#app',
  // 配置路由
  router,
  // 声明加载的自定义组件
  components: { App },
  // 使用App组件
  template: '<App/>'
});
