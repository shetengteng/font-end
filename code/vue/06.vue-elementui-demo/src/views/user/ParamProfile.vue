<template>
  <div>
    <div v-if="$route.params.id == 1111">
      传参方式1【/user/profile/:id】，接收方式1【$route.params.id】 ，值【{{$route.params.id}}】<br>
    </div>
    <div v-if="$route.params.id == 2222">
      传参方式2【router-link :to="{name : 'UserParamProfile' , params : {id : xxx}}"】，接收方式1【$route.params.id】 ，值【{{$route.params.id}}】<br>
    </div>
    接收方式2【props : ['id']】 ，值【{{id}}】<br>

  </div>
</template>

<script>
  export default {
      props : ['id'],
      name : 'UserParamProfile'

  }
</script>

<style>

</style>
