import { createWebHashHistory, createRouter } from 'vue-router';

export default createRouter({
  history: createWebHashHistory(),
  scrollBehavior() {
    return {top: 0}
  },

  routes: [
    {
      path: '/',
      name: 'EtcPauseApp',
      component: () => import(/* webpackChunkName: "scheduleApp" */'@/views/launcher/pause/etc-pause/comp/etc-pause'),
    },
  ]
})
