import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入 element-ui 组件
import './plugins/element.js'
// 导入字体图标
import '@/assets/fonts/iconfont.css'
// 导入全局样式
import '@/assets/css/global.css'
// 导入第三方插件
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// 导入进度条
import NProgress from 'nprogress'
// 导入进度条样式
import 'nprogress/nprogress.css'

// 导入axios
import axios from 'axios'
// 设置axios的根路径
axios.defaults.baseURL = 'http://server.sineava.top/api/private/v1/'

// axios 请求拦截，每次请求的时候都会进行一次处理，将token 发送给后端进行权限的校验
axios.interceptors.request.use(config => {
  // 当进入request拦截器，表示发送了请求，我们就开启进度条
  NProgress.start()
  // 在请求头中添加自定义字段 Authorization 值为 token，该字段可能是null
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// 有返回值则隐藏进度条
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

// 设置axios的全局变量
Vue.prototype.$http = axios

// productionTip = true 表示显示模式消息，显示常见错误提示
// 在生产时一般设置为false
Vue.config.productionTip = false

// 声明使用第三方组件
Vue.component('tree-table', TreeTable)

// 全局注册的方式，注册为全局可用的组件
Vue.use(VueQuillEditor)

// 全局过滤器，处理时间，将时间戳转换为时间格式
Vue.filter('dateFormat', originValue => {
  const dt = new Date(originValue)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
