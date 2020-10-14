import Vue from 'vue'
import Router from 'vue-router'

// webpackChunkName:"login_home_welcome" 表示vue文件打包到login_home_welcome.xxxx.js中
// 使用懒加载
const Login = () => import(/* webpackChunkName:"login_home_welcome" */ '@/components/Login')
const Home = () => import(/* webpackChunkName:"login_home_welcome" */ '@/components/Home')
const Welcome = () => import(/* webpackChunkName:"login_home_welcome" */ '@/components/Welcome')

const Users = () => import(/* webpackChunkName:"user" */ '@/components/user/Users')

const Rights = () => import(/* webpackChunkName:"power" */ '@/components/authority/Rights')
const Roles = () => import(/* webpackChunkName:"power" */ '@/components/authority/Roles')

const Cate = () => import(/* webpackChunkName:"goods" */ '@/components/goods/Cate')
const Params = () => import(/* webpackChunkName:"goods" */ '@/components/goods/Params')
const List = () => import(/* webpackChunkName:"goods" */ '@/components/goods/List')
const GoodAdd = () => import(/* webpackChunkName:"goods" */ '@/components/goods/Add')

const Order = () => import(/* webpackChunkName:"order" */ '@/components/order/Order')

const Report = () => import(/* webpackChunkName:"report" */ '@/components/report/Report')

// import Login from '@/components/Login'
// import Home from '@/components/Home'
// import Welcome from '@/components/Welcome'
// import Users from '@/components/user/Users'
// import Rights from '@/components/authority/Rights'
// import Roles from '@/components/authority/Roles'
// import Cate from '@/components/goods/Cate'
// import Params from '@/components/goods/Params'
// import List from '@/components/goods/List'
// import GoodAdd from '@/components/goods/Add'
// import Order from '@/components/order/Order'
// import Report from '@/components/report/Report'

Vue.use(Router)

const routes = [
  {
    path: '/',
    redirect: '/login' // 重定向到login地址
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    // 访问home,则重定向到home的welcome页面，需要在home中添加一个路由占位符
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: List },
      { path: '/goods/add', component: GoodAdd },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
    ]
  }
]

const router = new Router({
  routes
})

// 挂载路由守卫，在每次路由调用之前进行判断token是否存在，不存在则跳转到login页面
// to 表示要访问的路径
// from 表示从哪里来
// next 表示下一个要跳转的页面
router.beforeEach((to, from, next) => {
  // 如果直接跳转到login则放行
  if (to.path === '/login') {
    return next()
  }
  const token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  next()
})

export default router
