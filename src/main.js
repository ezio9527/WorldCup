import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'
import { Notify, Toast, Lazyload } from 'vant'
import 'vant/es/toast/style'
import * as buffer from 'buffer'
// 引入阿里图标
import '@/assets/iconfont/iconfont.css'
import '@/assets/iconfont/symbol.css'
import '@/assets/iconfont/iconfont'

import '@/server/http'
import '@/assets/theme/default/index.less'
import '@/plugins/Date'

if (typeof window.global === 'undefined') {
  window.global = window
}

if (typeof window.Buffer === 'undefined') {
  window.Buffer = buffer.Buffer
}

const app = createApp(App)

app.use(store).use(router).use(Notify).use(Toast).use(Lazyload)
app.mount('#app')
