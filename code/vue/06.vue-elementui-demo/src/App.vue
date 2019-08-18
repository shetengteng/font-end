<template>
  <div id="app">
      <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App',
  mounted() {
    window.addEventListener('unload', this.saveState);
  },
  methods: {
    saveState() {
//      sessionStorage.setItem('state', JSON.stringify(this.$store.state));
      // 模块化之后
      console.log(this.$store.state.user);
      alert(this.$store.state.user);
      sessionStorage.setItem('userState', JSON.stringify(this.$store.state.user));
    }
  }
}
</script>
