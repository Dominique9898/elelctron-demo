import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
//renderer进程需要增加vue的integration
import { Vue as VueIntegration } from '@sentry/integrations'
import * as Sentry from '@sentry/electron'
//如果想在dev也显示错误可以不加process.env.NODE_ENV === 'production'
//结合SentryPlugin插件的environment插件使用可以别区别prod和dev之间的bug
process.env.NODE_ENV === 'production' && Sentry.init({
  dsn: 'https://966c9d6a96ab4c2d8d2367709fcf81da@o410650.ingest.sentry.io/5287742',
  environment: process.env.NODE_ENV, //区分不同系统之间的bug(dev,pro)
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
