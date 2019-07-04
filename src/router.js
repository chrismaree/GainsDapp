import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Create from './views/Create.vue'
import Manage from './views/Manage.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'MoonSteps - Home',
      component: Home
    },
    {
      path: '/create',
      name: 'MoonSteps - Create',
      component: Create
    },
    {
      path: '/manage',
      name: 'MoonSteps - Manage',
      component: Manage
    },
  ]
})
