import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// CSS
import './assets/application.scss'

import VueCookies from 'vue-cookies'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


// cookie
Vue.use(VueCookies, { expire: '7d' })

// 1 day after, expire
Vue.$cookies.config('1d')
