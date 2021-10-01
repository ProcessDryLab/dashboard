import Vue from 'vue'
import App from './App.vue'
import router from './router.js'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { BootstrapVue } from 'bootstrap-vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import VueToastr from 'vue-toastr'

import DCRServices from './services/DCRServices.js'

// bootstrap
Vue.use(BootstrapVue)

// fontawesome
library.add(fas)
Vue.component('font-awesome-icon', FontAwesomeIcon)

// toastr
Vue.use(VueToastr, {
  defaultPosition: 'toast-bottom-right',
  defaultStyle: {
    opacity: 1,
    'box-shadow': 'none'
  }
})

// backend service
Vue.prototype.$backend = new DCRServices()

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

document.title = 'DCR Engine'
