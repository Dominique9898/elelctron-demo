import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
//renderer进程需要增加vue的integration
import { Vue as VueIntegration } from '@sentry/integrations'
import * as Sentry from '@sentry/electron'
process.env.NODE_ENV === 'production' && Sentry.init({
  dsn: 'https://966c9d6a96ab4c2d8d2367709fcf81da@o410650.ingest.sentry.io/5287742',
  release: 'demo-1', //对于sentryWebpackPlugin必须
  // release: process.env.SOURCE_VERSION,
  integrations: [
    new VueIntegration({
      Vue,
      attachProps: true,
      logErrors: true
    })
  ],
})

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
