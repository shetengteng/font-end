import Vue from 'vue';
import Router from 'vue-router';

import Login from '@/views/Login';
import Main from '@/views/Main';

// 用于嵌套路由组件
import UserProfile from '@/views/user/Profile';
import UserList from '@/views/user/List';

import UserParamProfile from '@/views/user/ParamProfile'

import NotFound from '@/views/error/404.vue'

Vue.use(Router);

export default new Router({
  routes:[
    {
      path : '/login',
      name : 'Login',
      component : Login
    },
    {
      path : '/main',
      name : 'Main',
      component : Main,
      // 配置嵌套路由
      children : [
        {path : '/user/profile' , component : UserProfile},
        {path : '/user/list' , component : UserList},
        // 参数传递 : 表示一个占位符
        {path : '/user/profile/:id' , component : UserParamProfile ,name : 'UserParamProfile', props: true},
      ]
    },
    {
      path : '/main2/:username',
      name : 'Main',
      component : Main,
      // 配置嵌套路由
      children : [
        {path : '/user/profile' , component : UserProfile},
        {path : '/user/list' , component : UserList},
        // 参数传递 : 表示一个占位符
        {path : '/user/profile/:id' , component : UserParamProfile ,name : 'UserParamProfile', props: true},
      ]
    },
    {
      path : '/goHome',
      redirect : '/main'
    },
    {
      path : '/goHomeParam/:username',
      redirect : '/main2/:username'
    },
    {
      path : '*',
      component : NotFound
    }
  ]
});
