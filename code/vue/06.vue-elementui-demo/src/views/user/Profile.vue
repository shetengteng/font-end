<template>
  <div>
    个人信息
  </div>
</template>

<script>
  export default {
      name : 'UserProfile',
      beforeRouteEnter : (to,from,next) => {
          console.log('准备进入UserProfile');
          // 跳到下一个路由，没有此方法，那么会阻塞在当前路径
          next(vm => {
              vm.getData();
          });
      },
      beforeRouteLeave : (to,from,next) => {
          console.log('准备离开 UserProfile');
          next();
      },
      methods:{
          getData() {
              this.axios({
                method : 'get',
                url : 'http://localhost:8081/data/get'
              }).then(response => {
                 console.log(response);
              }).catch(error => {
                 console.log(error);
              });
          }
      }
  }
</script>

<style>

</style>
