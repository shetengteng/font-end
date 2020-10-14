import Vue from 'vue'
import {
  Alert,
  Aside,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  Cascader,
  Checkbox,
  CheckboxGroup,
  Col,
  Container,
  Dialog,
  Form,
  FormItem,
  Header,
  Input,
  Main,
  Menu,
  MenuItem,
  MenuItemGroup,
  Message,
  MessageBox,
  Option,
  Pagination,
  Row,
  Select,
  Step,
  Steps,
  Submenu,
  Switch,
  Table,
  TableColumn,
  TabPane,
  Tabs,
  Tag,
  Timeline,
  TimelineItem,
  Tooltip,
  Tree,
  Upload
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(Aside)
Vue.use(Main)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)

// 对于message 组件需要使用原型的方式引用
Vue.prototype.$msg = Message
Vue.prototype.$confirm = MessageBox.confirm

// 由于timeline是element-ui再2.6.0提供的，需要额外安装timeline组件
// import Timeline from './timeline/index'
// import Timeline from './timeline/index'
Vue.use(Timeline)
Vue.use(TimelineItem)
