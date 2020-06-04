- 在标签处有ref指定
```vue
<el-form ref="loginForm" 
      :model="loginForm" 
      :rules="loginRules"  

// 使用$refs直接调用该模块  减少获取dom节点的消耗
this.$refs.loginForm.validate(valid => {
```

- 一般获取DOM元素，需document.querySelector（".loginForm"）获取这个dom节点，然后在获取loginForm的值
- 用ref绑定之后不需要在获取dom节点，直接在上面的loginForm上绑定，然后$refs里面调用就行