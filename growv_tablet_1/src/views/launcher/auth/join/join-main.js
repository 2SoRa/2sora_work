import { createApp } from 'vue'
import App from './join-app.vue'
import vSelect from 'vue-select'
import router from '@/routes/launcher/join-index'

createApp(App)
  .component('v-select', vSelect)
  // .use(store)
  .use(router)
  .mount('#app')
