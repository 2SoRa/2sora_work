import { createApp } from 'vue'
import App from './readingclub-main-app'
import vSelect from 'vue-select'
import store from '@/store/index'
import router from '@/routes/launcher-readingclub/main-index'
import '@/assets/scss/common.scss'
import '@/assets/scss/launcher_readingclub.scss'

const app = createApp(App);
    app.component('v-select', vSelect)
    app.use(store)
    app.use(router)
    app.mount('#app')

