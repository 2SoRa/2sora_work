import { createApp } from 'vue'
import App from './play-math-app'
import vSelect from 'vue-select'
import store from '@/store/index'
import router from '@/routes/launcher/play-math-index'

createApp(App)
    .component('v-select', vSelect)
    .use(store)
    .use(router)
    .mount('#app')
