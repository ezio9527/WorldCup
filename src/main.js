import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'
import { Lazyload } from 'vant'

import '@/server/http'
import '@/assets/theme/default/index.less'
import '@/plugins/Date'

const app = createApp(App)

app.use(store).use(router).use(Lazyload)
app.mount('#app')
