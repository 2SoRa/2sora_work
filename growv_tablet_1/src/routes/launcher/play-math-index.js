import { createWebHashHistory, createRouter } from 'vue-router';

export default createRouter({
  history: createWebHashHistory(),
  scrollBehavior() {
    return {top: 0}
  },

  routes: [
    {
      path: '/',
      name: 'PlayMathApp',
      component: () => import(/* webpackChunkName: "PlayMathApp" */'@/views/launcher/play-math/play-math-app'),
      children: [
        {
          path: '',
          name: 'PlayMathMain',
          component: () => import(/* webpackChunkName: "PlayMathMain" */'@/views/launcher/play-math/comp/play-math-main'),
        }
      ]
    },
  ]
})
