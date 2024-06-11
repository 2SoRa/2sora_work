export default [
  {
    path: '/my-tree/2023/08',
    name: 'myTree202308',
    component: () => import(/* webpackChunkName: "myTree202308" */'@/views/launcher-readingclub/main-comp/my-tree/comp/2023/2023-sub/2308'),
  },
  {
    path: '/my-tree/2023/09',
    name: 'myTree202309',
    component: () => import(/* webpackChunkName: "myTree202309" */'@/views/launcher-readingclub/main-comp/my-tree/comp/2023/2023-sub/2309'),
  },
  {
    path: '/my-tree/2023/10',
    name: 'myTree202310',
    component: () => import(/* webpackChunkName: "myTree202310" */'@/views/launcher-readingclub/main-comp/my-tree/comp/2023/2023-sub/2310'),
  },
  {
    path: '/my-tree/2023/11',
    name: 'myTree202311',
    component: () => import(/* webpackChunkName: "myTree202310" */'@/views/launcher-readingclub/main-comp/my-tree/comp/2023/2023-sub/2311'),
  },
  {
    path: '/my-tree/2023/12',
    name: 'myTree202312',
    component: () => import(/* webpackChunkName: "myTree202310" */'@/views/launcher-readingclub/main-comp/my-tree/comp/2023/2023-sub/2312'),
  },
]
