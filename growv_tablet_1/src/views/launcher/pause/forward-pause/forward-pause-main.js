import { createApp } from 'vue'
import App from './forward-pause-app'
import vSelect from 'vue-select'
import store from '@/store/index'
import router from '@/routes/launcher/forward-pause-index'

createApp(App)
    .component('v-select', vSelect)
    .use(store)
    .use(router)
    .mount('#app')
