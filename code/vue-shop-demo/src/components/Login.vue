<template>
  <div class="login_container">
    <!--登录盒子-->
    <div class="login_box">
      <!--头像-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!--登录表单 label-width 用于el-form上的label的宽度设置为0-->
      <el-form :model="loginForm" ref="loginFormRef" :rules="loginFormRules"
               class="login_form" label-width="0px">
        <!--
          用户名
          通过prop访问loginForm对象中的username属性
          用于validate和resetFields操作
        -->
        <el-form-item prop="username">
          <!--注意：只能使用v-model进行赋值-->
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <!--按钮-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 数据绑定
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则
      loginFormRules: {
        // 验证规则
        username: [
          // required min max 属于固定格式和参数
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '登录名长度为3-10个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度在6-15个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 登录
    login() {
      // 点击登录的时候先调用validate方法校验参数是否有效
      this.$refs.loginFormRef.validate(async valid => {
        // 通过loginFormRules中规则的验证 如果valid返回为true 表示通过
        if (!valid) {
          return
        }
        // 由于axios的post方法返回的是一个promise对象，需要转换为同步接收返回值的方式
        const { data: res } = await this.$http.post('login', this.loginForm)
        // 解析返回值中的data数据结构
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$msg.error('登录失败: ' + res.meta.msg)
        }
        this.$msg.success('登录成功')
        // 保存token
        window.sessionStorage.setItem('token', res.data.token)
        // 编程式导航到 /home
        this.$router.push('/home')
      })
    },
    // 重置表单参数
    reset() {
      // this 表示当前组件对象，含有$refs对象，该对象中含有loginFormRef对象
      // console.log(this)
      // 重置参数为默认值
      this.$refs.loginFormRef.resetFields()
    }
  }
}

</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  /* 向上 x 轴移动自身长度的50%，向左 y 轴移动自身长度的50% */
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    box-shadow: 0 0 10px #ddd;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  // 固定盒子的大小，添加padding后不改变盒子的大小
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}

</style>
