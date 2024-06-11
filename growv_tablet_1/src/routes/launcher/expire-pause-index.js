import { createWebHashHistory, createRouter } from 'vue-router';

export default createRouter({
  history: createWebHashHistory(),
  scrollBehavior() {
    return {top: 0}
  },

  routes: [
    {
      path: '/',
      name: 'ExpirePauseApp',
      component: () => import(/* webpackChunkName: "scheduleApp" */'@/views/launcher/pause/expire-pause/comp/expire-pause'),
    },
  ]
})
