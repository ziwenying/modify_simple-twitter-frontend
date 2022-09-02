import Vue from 'vue'
import Vuex from 'vuex'
import usersAPI from './../apis/users'
import { Toast } from './../utils/helpers'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentUser: {
      id: -1,
      account: '',
      email: '',
      avatar: '',
      role: ''
    },
    isAuthenticated: false,
    topPopular: [],
  },
  getters: {
  },
  mutations: {
    setCurrentUser(state, currentUser) {
      state.currentUser = {
        //原本的預設資料
        ...state.currentUser,
        // 用 api 取得的資料覆蓋
        ...currentUser
      }
      state.isAuthenticated = true
    },
    revokeAuthentication(state) {
      state.currentUser = {}
      state.isAuthenticated = false
      localStorage.removeItem('token')
    },
    setTopPopular(state, topPopular) {
      state.topPopular = [...topPopular]
    }
  },
  actions: {
    async fetchCurrentUser({ commit }) {
      try {
        const response = await usersAPI.getCurrentUser()
        if (response.status !== 200 && response.statusText !== 'OK') {
          throw new Error(response.data.message)
        }
        const { id, name, account, avatar, role } = { id: response.data.id, name: response.data.name, account: response.data.account, avatar: response.data.avatar, role: response.data.role }
        // use commit >> call setCurrentUser in mutations
        commit('setCurrentUser', {
          id, name, account, avatar, role
        })
        // login success
        return { isAuthenticated: true, role: this.state.currentUser.role }
      } catch (error) {
        // login fail
        Toast.fire({
          icon: "error",
          title: "無法取得當前使用者資料，請稍後再試",
        });
        return { isAuthenticated: false, role: '' }
      }
    },
    async fetchPopular({ commit }) {
      try {
        const response = await usersAPI.getTopUser();
        const { data } = response;
        if (response.statusText !== "OK") {
          throw new Error(data.message);
        }
        commit('setTopPopular', data)
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "無法取得當前推薦追蹤名單，請稍後再試",
        });
      }
    }
  },
  modules: {
  }
})
