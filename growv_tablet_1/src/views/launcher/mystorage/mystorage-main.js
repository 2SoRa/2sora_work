import { createApp } from 'vue'
import App from './mystorage-app.vue'
import vSelect from 'vue-select'
import store from '@/store/index'
import router from '@/routes/launcher/mystorage-index'

createApp(App)
    .component('v-select', vSelect)
    .use(store)
    .use(router)
    .mount('#app')
