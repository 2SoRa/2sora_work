export default [
  {
    path: '/my-tree',
    name: 'myTreeApp',
    component: () => import(/* webpackChunkName: "myTreeApp" */'@/views/launcher-readingclub/main-comp/my-tree/my-tree-app'),
    children: [
      {
        path: '',
        name: 'myTreeMain',
        component: () => import(/* webpackChunkName: "myTreeMain" */'@/views/launcher-readingclub/main-comp/my-tree/comp/my-tree-main'),
      },
			{
				path: ':year/:month',
				name: 'myTreeSub',
				component: () => import(/* webpackChunkName: "myTreeMain" */'@/views/launcher-readingclub/main-comp/my-tree/comp/my-tree-sub'),
			}
    ]
  }
]
