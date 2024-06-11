export default [
  {
    path: "/mysuperbook",
    name: "mysuperbookApp",
    component: () => import(/* webpackChunkName: "mysuperbookApp" */ "@/views/launcher-readingclub/main-comp/mysuperbook/mysuperbook-app"),
    children: [
      {
        path: "",
        name: "mysuperbookMain",
        component: () => import(/* webpackChunkName: "mysuperbookMain" */ "@/views/launcher-readingclub/main-comp/mysuperbook/comp/mysuperbook-main"),
        children: [
          {
            path: "",
            name: "mysuperbookWeek",
            component: () => import(/* webpackChunkName: "mysuperbookWeek" */ "@/views/launcher-readingclub/main-comp/mysuperbook/comp/mysuperbook-week-report"),
          },
          {
            path: "month",
            name: "mysuperbookMonth",
            component: () => import(/* webpackChunkName: "mysuperbookMonth" */ "@/views/launcher-readingclub/main-comp/mysuperbook/comp/mysuperbook-month-report"),
          }
        ],
      }
    ],
  },
];
