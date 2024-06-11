export default [
  {
    path: '/my-tree/2024/01',
    name: 'myTree202401',
    component: () => import(/* webpackChunkName: "myTree202401" */'@/views/launcher-readingclub/main-comp/my-tree/comp/2024/2024-sub/2401'),
  },
  {
    path: '/my-tree/2024/02',
    name: 'myTree202402',
    component: () => import(/* webpackChunkName: "myTree202402" */'@/views/launcher-readingclub/main-comp/my-tree/comp/2024/2024-sub/2402'),
  },
]
