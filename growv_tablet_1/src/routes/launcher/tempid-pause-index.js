import { createWebHashHistory, createRouter } from 'vue-router';

export default createRouter({
  history: createWebHashHistory(),
  scrollBehavior() {
    return {top: 0}
  },

  routes: [
    {
      path: '/',
      name: 'TempIdPauseApp',
      component: () => import(/* webpackChunkName: "scheduleApp" */'@/views/launcher/pause/tempid-pause/comp/tempid-pause.vue'),
    },
  ]
})
