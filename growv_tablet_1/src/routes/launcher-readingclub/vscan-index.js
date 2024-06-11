export default [
  {
    path: '/vscan/check/:id',
    name: 'vscanCheck',
    component: () => import('@/views/launcher-readingclub/main-comp/vscan/vscan-check.vue')
  },
  {
    path: '/vscan/rescan',
    name: 'vscanRescan',
    component: () => import('@/views/launcher-readingclub/main-comp/vscan/vscan-rescan.vue')
  },
  {
    path: '/vscan/fail',
    name: 'vscanFail',
    component: () => import('@/views/launcher-readingclub/main-comp/vscan/vscan-fail.vue')
  },
  {
    path: '/vscan/buy',
    name: 'vscanBuy',
    component: () => import('@/views/launcher-readingclub/main-comp/vscan/vscan-buy.vue')
  },
]
