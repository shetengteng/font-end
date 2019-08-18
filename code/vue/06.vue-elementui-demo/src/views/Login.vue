<template>
  <div>
    <el-form ref="myForm" :model="form" :rules="rules" label-width="80px" class="login-box">
        <h3 class="login-title">欢迎登录</h3>
        <el-form-item label="账号" prop="username">
          <el-input type="text" v-model="form.username"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="login('myForm')">登录</el-button>
        </el-form-item>

    </el-form>

  </div>
</template>

<script>
    export default {
        name : 'Login',
        data(){
            return {
                form : {
                    username : '',
                    password : ''
                },
                rules : {
                   username : [
                     { required: true, message: '请输入活动名称', trigger: 'blur' }
                   ],
                   password : [
                     { required: true, message: '请输入密码', trigger: 'blur' }
                   ]
                },
            }
        },
        methods : {
          login(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                sessionStorage.setItem("isLogin",true);
                this.$store.dispatch("asyncUpdateUser",{username:this.form.username});
                // 使用 vue-router 路由到指定页面，该方式称之为编程式导航
//                this.$router.push("/main");
                // 编程式导航传参
                this.$router.push({name : 'Main',params : {username:this.form.username}});
              } else {
                this.$message.error('错了哦，这是一条错误消息');
                return false;
              }
            });
          }
        }
    }
</script>

<style lang="scss" scoped>
  .login-box {
    width: 350px;
    margin: 150px auto;
    border: 1px solid #DCDFE6;
    padding: 35px 35px 35px 5px;
    border-radius: 5px;
    box-shadow: 0 0 25px #DCDFE6;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
  }

  .login-title {
    text-align: center;
    margin: 0 auto 40px auto;
    color: #303133;
  }

</style>
