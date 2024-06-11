import { createWebHashHistory, createRouter } from 'vue-router';

export default createRouter({
  history: createWebHashHistory(),
  scrollBehavior () {
    return { top: 0 }
  },

  // pages
  routes: [

  ]
});