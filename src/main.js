import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import VueMaterial from 'vue-material'
import VModal from 'vue-js-modal'
import Jazzicon from 'vue-jazzicon';
import VueApexCharts from 'vue-apexcharts'
import VueSlider from 'vue-slider-component'

import 'vue-slider-component/theme/default.css'
import 'vue-material/dist/vue-material.min.css'
import "typeface-space-mono";

Vue.component('apexchart', VueApexCharts)
Vue.component('jazzicon', Jazzicon);
Vue.component('VueSlider', VueSlider)

Vue.use(VueMaterial)
Vue.use(VModal)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
