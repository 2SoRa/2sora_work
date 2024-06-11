import { createWebHashHistory, createRouter } from 'vue-router';

export default createRouter({
  history: createWebHashHistory(),
  scrollBehavior() {
    return {top: 0}
  },

  routes: [
    {
      path: '/',
      name: 'SuperboxApp',
      component: () => import(/* webpackChunkName: "SuperboxApp" */'@/views/launcher/superbox/superbox-app'),
      children: [
        {
          path: '',
          name: 'SuperboxMain',
          component: () => import(/* webpackChunkName: "SuperboxMain" */'@/views/launcher/superbox/comp/superbox-main'),
        },
        {
          path: 'book/:id/:selCd',
          name: 'SuperboxSub',
          component: () => import(/* webpackChunkName: "SuperboxSub" */'@/views/launcher/superbox/comp/superbox-sub'),
          props: true,
        },
      ]
    },
  ]
})
