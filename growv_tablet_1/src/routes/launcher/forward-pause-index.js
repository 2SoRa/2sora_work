import { createWebHashHistory, createRouter } from 'vue-router';

export default createRouter({
  history: createWebHashHistory(),
  scrollBehavior() {
    return {top: 0}
  },

  routes: [
    {
      path: '/',
      name: 'ForwardPauseApp',
      component: () => import(/* webpackChunkName: "scheduleApp" */'@/views/launcher/pause/forward-pause/comp/forward-pause'),
    },
  ]
})
