- vue中使用:rules指定校验规则
- 在代码中，添加属性 :rule

```vue
<Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit" class="form-con">
    <FormItem prop="phone">
        <Input v-model="form.phone" prefix="md-person" placeholder="请输入您的手机号" size="large" class="login-form-input" :maxlength="11"></Input>
    </FormItem>
    <FormItem prop="password">
        <Input type="password" v-model="form.password" prefix="md-lock" placeholder="请输入您的密码" size="large" class="login-form-input" :maxlength="100"></Input>
    </FormItem>
    <FormItem prop="code">
        <Input v-model="form.code" placeholder="请输入验证码" prefix="ios-barcode" size="large" class="login-form-input" :maxlength="4"></Input>
        <img @click="refLoginImg" :src="loginImgSrc" class="login-img"/>
    </FormItem>
    <FormItem>
        <Button @click="handleSubmit" :loading="submitLoading" type="info" long size="large" class="login-btn" icon="md-log-in">
            <span v-if="!submitLoading">立即登录</span>
            <span v-else>正在登录，请稍候...</span>
        </Button>
    </FormItem>
</Form>
```

- 新建一个文件（validate.js）定义验证规则

```js
//验证手机号
export function isPhone(rule, value, callback) {
    if (!value) {
        return callback(new Error('输入不可以为空'));
    }
    var pattern = /^1[34578]\d{9}$/
    if(pattern.test(value)){
        return callback()
    }
    return callback(new Error('输入的手机号错误'))
}

```

- 在页面(xx.vue)中引入验证规则定义的文件，并在export default中定义rule规则，使用语法：{validator:验证方法,trigger:验证触发} validator

```js
rules: {
    phone: [
        { required: true, message: '手机号不能为空', trigger: 'blur' },
        { type: 'string', min: 11, message: '手机号不允许小于11位', trigger: 'blur' },
        { validator: isPhone, trigger: 'blur' }, # 使用声明的校验规则
    ],
	password: [
        { required: true, message: '密码不能为空', trigger: 'blur' },
        { type: 'string', min: 6, message: '密码不允许小于6位', trigger: 'blur' },
	],
	code: [
        { required: true, message: '验证码不能为空', trigger: 'blur' },
        { type: 'string', min: 4, message: '验证码必须是4位', trigger: 'blur' },
   ],
},
```