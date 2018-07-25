import Vue from 'vue'
import Vuetify from 'vuetify'
import Router from 'vue-router'

import VueResource from 'vue-resource'

Vue.use(Router)
Vue.use(VueResource)
Vue.use(Vuetify, {
  theme: {
    primary: '#64dd17',
    secondary: '#1faa00',
    accent: '#9cff57',
    error: '#fdd835',
    warning: '#1de9b6'
  }
})

let testRoutes = require('./routes').default

export default new Router({
  mode: 'history',
  routes: testRoutes
})
