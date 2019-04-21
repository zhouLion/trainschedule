import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import Vuetify from 'vuetify'
import zhHans from 'vuetify/es5/locale/zh-Hans'
import Message from 'vue-m-message'
import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader

// index.js or main.js
import './assets/css/scroll.styl' // Ensure you are using css-loader
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader

Vue.use(Vuetify, {
  lang: {
    locales: { zhHans },
    current: 'zhHans'
  }
})

Vue.use(Message, {
  name: "Message"
})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
