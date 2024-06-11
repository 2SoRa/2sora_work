import { createApp } from 'vue'
import App from './mypage-app.vue'
import vSelect from 'vue-select'
import store from '@/store/index'
import router from '@/routes/launcher/mypage-index'

createApp(App)
    .component('v-select', vSelect)
    .use(store)
    .use(router)
    .mount('#app')
