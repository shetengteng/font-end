<template>
  <el-container class="home_container">
    <!--头部区域-->
    <el-header>
      <div>
        <!--logo-->
        <img src="../assets/heima.png" alt="">
        <!--顶部标题-->
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--页面主体区域-->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="toggle_button" @click="toggleCollapse()">|||</div>
        <!--
            侧边栏菜单
            unique-opened true 每次只打开一个
            collapse-transition 关闭切换动画
            router true 开启路由模式，将index作为path进行跳转
            default-active 显示激活的项目
        -->
        <el-menu background-color="#333744"
                 text-color="#fff"
                 active-text-color="#409EFF"
                 :unique-opened="true"
                 :collapse="isCollapse"
                 :collapse-transition="false"
                 :router="true"
                 :default-active="activePath">
          <!--一级菜单 index 使用 path 为了可以直接跳转到该path-->
          <el-submenu :index="'/'+item.path" v-for="item in menuList" :key="item.id">
            <!--一级菜单模板-->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item :index="'/'+subItem.path"
                          v-for="subItem in item.children"
                          :key="subItem.id"
                          @click="saveNavState('/'+subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体结构 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 格式 id authName path order children:[]
      menuList: [],
      // 图标对象，用于给列表的图标赋值
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 对菜单栏进行切换和展开
      isCollapse: false,
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      // 清除session中的token
      window.sessionStorage.clear()
      // 退回到登录页面
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$msg.error(res.meta.msg)
      }
      this.menuList = res.data
    },
    // 点击按键，对菜单栏进行折叠和展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    saveNavState(activePath) {
      this.activePath = activePath
      // 保存到sessionStorage中，下次刷新的时候取出
      window.sessionStorage.setItem('activePath', activePath)
    }
  }
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}

.el-header {
  background-color: #373D41;
  padding-left: 0; // 让图标靠左，去除el-header中的默认padding
  display: flex;
  justify-content: space-between;
  align-items: center; // 让div 在纵轴方向居中对齐
  color: #fff;
  font-size: 20px;

  > div { // 表示 el-header下的子div 而不包含孙子div
    display: flex;
    align-items: center;

    span {
      margin-left: 10px;
    }
  }
}

.el-aside {
  background-color: #333744;
  // 解决菜单栏边框多出1px的边框
  .el-menu {
    border-right: 0;
  }

  .toggle_button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center; // 文字居中
    letter-spacing: 0.5em; // 每个字之间的间距
    cursor: pointer;
  }
}

.el-main {
  background-color: #eaedf1;
}

// 用于调整图标的间距
.iconfont {
  margin-right: 10px;
}

</style>
