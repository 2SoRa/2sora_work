export default [
  {
    path:'/status',
    name:'readingStatusMain',
    component: () => import(/* webpackChunkName: "readingStatusMain" */'@/views/launcher-readingclub/main-comp/reading-status/reading-status-main'),
    children: [
      {
        path:'',
        name:'readingStatusAttend',
        component: () => import(/* webpackChunkName: "readingStatusAttend" */'@/views/launcher-readingclub/main-comp/reading-status/reading-status-attend/reading-status-attend-main.vue'),
      },
      {
        path:'active',
        name:'readingStatusActiveList',
        component: () => import(/* webpackChunkName: "readingStatusActive" */'@/views/launcher-readingclub/main-comp/reading-status/reading-status-active/comp/reading-status-active-list'),
      },
      {
        path:'active/calendar',
        name:'readingStatusActiveCalendar',
        component: () => import(/* webpackChunkName: "readingStatusActiveCalendar" */'@/views/launcher-readingclub/main-comp/reading-status/reading-status-active/comp/reading-status-active-calendar'),
      },
    ],
  }
]