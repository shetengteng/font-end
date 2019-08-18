<template>
  <div>
    <!--一个全局的container-->
    <el-container>

        <!--左侧侧边栏-->
        <el-aside width="200px;">
          <!--菜单选项 default-openeds 表示默认开启的菜单项，值是index-->
          <el-menu :default-openeds="['1']">
            <!--子菜单-->
            <el-submenu index="1">
                <!--注意：此处使用了插槽，要理解插槽的用途-->
                <template slot="title"><i class="el-icon-message"></i>用户管理</template>
                <el-menu-item-group title="嵌套路由">
                  <el-menu-item index="1-1">
                    <router-link to="/user/profile">用户信息</router-link>
                  </el-menu-item>
                  <el-menu-item index="1-2">
                    <router-link to="/user/list">用户列表</router-link>
                  </el-menu-item>
                </el-menu-item-group>


                <el-menu-item-group title="参数传递">
                  <el-menu-item index="1-3">
                    <!--传递用户参数 id=1111-->
                    <router-link to="/user/profile/1111">用户id传参-方式1</router-link>
                  </el-menu-item>
                  <el-menu-item index="1-4">
                    <router-link :to="{name : 'UserParamProfile' , params : {id : 2222}}">用户id传参-方式2</router-link>
                  </el-menu-item>
                </el-menu-item-group>

              <el-menu-item-group title="重定向">
                <el-menu-item index="1-5">
                  <router-link to="/goHome">回到首页</router-link>
                </el-menu-item>
                <el-menu-item index="1-6">
                  <router-link to="/goHomeParam/sssss">回到首页-带参数</router-link>
                </el-menu-item>
              </el-menu-item-group>


            </el-submenu>
            <el-submenu index="2">
              <!--注意：此处使用了插槽，要理解插槽的用途-->
              <template slot="title"><i class="el-icon-message"></i>内容管理</template>
              <el-menu-item-group>
                <el-menu-item index="2-1">分类管理</el-menu-item>
                <el-menu-item index="2-2">内容列表</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>

       <!--右侧内容容器-->
       <el-container>

         <!--右侧容器头部-->
         <el-header style="text-align: right; font-size: 12px">
           <el-dropdown>
             <i class="el-icon-setting" style="margin-right: 15px"></i>
             <el-dropdown-menu slot="dropdown">
               <el-dropdown-item>个人信息</el-dropdown-item>
               <el-dropdown-item>
                  <router-link to="/logout">退出登录</router-link>
               </el-dropdown-item>
             </el-dropdown-menu>
           </el-dropdown>
           <!--接收的参数在切换下一个页面组件的时候，该参数就消失了，需要放在vuex中-->
           <!--<span>{{$route.params.username}}</span>-->
           <!--使用vuex获取属性的值-->
           <span>{{$store.getters.getUser.username}}</span>
         </el-header>

         <!--右侧内容,通过路由显示不同的页面组件-->
         <el-main>
            <router-view/>
         </el-main>

       </el-container>

    </el-container>
  </div>
</template>

<script>
  export default {
      name : 'Main'
  }
</script>

<style>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }

</style>
