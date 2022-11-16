import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'
import { Lazyload } from 'vant'

import '@/server/http'
import '@/assets/theme/default/index.less'
import '@/plugins/Date'
import * as buffer from 'buffer'

if (typeof window.global === 'undefined') {
  window.global = window
}

if (typeof window.Buffer === 'undefined') {
  window.Buffer = buffer.Buffer
}

const app = createApp(App)

app.use(store).use(router).use(Lazyload)
app.mount('#app')
