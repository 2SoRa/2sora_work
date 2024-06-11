export default [
  {
    path: "/search",
    name: "searchMain",
    component: () => import('@/views/launcher-readingclub/main-comp/vscan-search/vscan-search-main.vue'),
    children: [
      {
        path: '/:lang/:active/:subactive',
        name: 'searchList',
        component: () => import('@/views/launcher-readingclub/main-comp/vscan-search/vscan-search-list.vue')
      }
    ],

  },
  {
    path: "/search/english",
    name: "searchEnglish",
    component: () => import('@/views/launcher-readingclub/main-comp/vscan-search/vscan-search-english.vue')
  },
  {
    path: "/search/detail/:id",
    name: "searchDetail",
    component: () => import('@/views/launcher-readingclub/main-comp/vscan-search/vscan-search-detail.vue')
  },
  {
    path: "/search/cart",
    name: "searchCart",
    component: () => import('@/views/launcher-readingclub/main-comp/vscan-search/vscan-search-cart.vue')
  },
  {
    path: "/search/form",
    name: "searchForm",
    component: () => import('@/views/launcher-readingclub/main-comp/vscan-search/vscan-search-form.vue')
  }
]
