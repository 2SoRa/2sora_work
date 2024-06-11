export default [
  {
    path: "/myLibrary",
    name: "myLibraryMain",
    component: () => import(/* webpackChunkName: "LibraryMain" */ "@/views/launcher-readingclub/main-comp/my-library/library-main.vue"),
    children:[
      {
        path: "",
        name: "myLibraryTodayBook",
        component: () => import(/* webpackChunkName: "todayBook" */ "@/views/launcher-readingclub/main-comp/my-library/comp/todayBook.vue")
      },
      {
        path: "storage",
        name: "myLibraryStorage",
        component: () => import(/* webpackChunkName: "storage" */ "@/views/launcher-readingclub/main-comp/my-library/comp/storage.vue")
      },
      {
        path: "v-scan",
        name: "myLibraryVscan",
        component: () => import(/* webpackChunkName: "vScan" */ "@/views/launcher-readingclub/main-comp/my-library/comp/v-scan.vue")
      },
    ]
  },
];