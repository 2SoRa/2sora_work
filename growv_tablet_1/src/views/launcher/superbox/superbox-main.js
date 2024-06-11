import { createApp } from 'vue'
import App from './superbox-app.vue'
import vSelect from 'vue-select'
import store from '@/store/index'
import router from '@/routes/launcher/superbox-index'

createApp(App)
    .component('v-select', vSelect)
    .use(store)
    .use(router)
    .mount('#app')
