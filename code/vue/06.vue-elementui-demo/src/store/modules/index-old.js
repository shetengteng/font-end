import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

// // 全局 state 对象，用于保存所有组件的公共数据
// const state = {
//   // 在组件中是通过 this.$store.state.user 来获取
//   user:{
//     username:''
//   }
// };
// 说明每次刷新，vuex对象就会重新建立
const state = sessionStorage.getItem('state') ? JSON.parse(sessionStorage.getItem('state')) : {
  user: {
    username: ''
  }
};

// 实时监听 state 值的最新状态，注意这里的 getters 可以理解为计算属性
const getters = {
    // 在组件中是通过 this.$store.getters.getUser 来获取
    getUser(state){
      return state.user;
    }
};

// 同步方法执行修改
const mutations = {
  // 在组件中是通过 this.$store.commit('updateUser', user); 方法来调用 mutations
    updateUser(state,user){
      state.user = user;
    }
};

// 异步方法执行修改，异步调用同步
const actions = {
  // 在组件中是通过 this.$store.dispatch('asyncUpdateUser', user); 来调用 actions
  asyncUpdateUser(context,user){
    context.commit('updateUser',user);
  }
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});

