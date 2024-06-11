import { createWebHashHistory, createRouter } from 'vue-router';

export default createRouter({
  history: createWebHashHistory(),
  scrollBehavior() {
    return {top: 0}
  },

  routes: [
    {
      path: '/',
      name: 'ScheduleApp',
      component: () => import(/* webpackChunkName: "scheduleApp" */'@/views/launcher/schedule/schedule-app'),
      children: [
        {
          path: '',
          name: 'ScheduleMain',
          component: () => import(/* webpackChunkName: "ScheduleMain" */'@/views/launcher/schedule/comp/schedule'),
        },
        {
          path: 'status',
          name: 'ScheduleStatus',
          component: () => import(/* webpackChunkName: "ScheduleStatus" */'@/views/launcher/schedule/comp/schedule-status')
        },
        {
          path: 'scheduleReg',
          name: 'ScheduleReg',
          component: () => import(/* webpackChunkName: "ScheduleReg" */'@/views/launcher/schedule/comp/schedule-reg')
        },
        {
          path: '/404',
          name: 'notFound',
          component: () => import('@/views/common/not-found'),
        },
        {
          path: '/:pathMatch(.*)*',
          redirect: "/404"
        },
      ]
    },
  ]
})
