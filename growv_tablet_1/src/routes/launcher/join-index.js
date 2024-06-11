export default [
  {
    path: 'join',
    name: 'joinApp',
    component: () => import(/* webpackChunkName: "joinApp" */'@/views/launcher/auth/join/join-app'),
    children: [
      {
        path: '',
        name: 'joinGuide',
        component: () => import(/* webpackChunkName: "loginGuide" */'@/views/launcher/auth/join/comp/join-guide'),
      },
      {
        path: 'joinMain',
        name: 'joinMain',
        component: () => import(/* webpackChunkName: "joinMain" */'@/views/launcher/auth/join/comp/join-reg'),
        props: true
      },
      {
        path: 'joinSuccess',
        name: 'joinSuccess',
        component: () => import(/* webpackChunkName: "joinSuccess" */'@/views/launcher/auth/join/comp/join-success'),
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
  }
]

