import { createApp } from 'vue'
import App from './login-app.vue'
import vSelect from 'vue-select'
import router from '@/routes/launcher/login-index'
import store from '@/store/launcher/login-index'

const app = createApp(App)
app.config.globalProperties.$store = store
app.config.globalProperties.$router = router
window.app = app
  .component('v-select', vSelect)
  .use(store)
  .use(router)
  .mount('#app')
