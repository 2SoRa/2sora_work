export default [
  {
    path: "/english-library",
    name: "englishLibraryMain",
    component: () =>
      import(
        /* webpackChunkName: "englishLibraryMain" */ "@/views/launcher-readingclub/main-comp/english-library/english-library-main.vue"
      ),
    children: [
      {
        path: "",
        name: "englishLibraryStep",
        component: () =>
          import(
            /* webpackChunkName: "englishLibraryStep" */ "@/views/launcher-readingclub/main-comp/english-library/english-library-step/english-library-step-main.vue"
          ),
      },
      {
        path: "theme",
        name: "englishLibraryTheme",
        component: () =>
          import(
            /* webpackChunkName: "englishLibraryTheme" */ "@/views/launcher-readingclub/main-comp/english-library/english-library-theme/english-library-theme-main.vue"
          ),
      },
      {
        path: "keyword",
        name: "englishLibraryKeyword",
        component: () =>
          import(
            /* webpackChunkName: "englishLibraryKeyword" */ "@/views/launcher-readingclub/main-comp/english-library/english-library-keyword/english-library-keyword-main.vue"
          ),
      },
      {
        path: "keyword",
        name: "englishLibraryKeyword",
        component: () =>
          import(
            /* webpackChunkName: "englishLibraryKeyword" */ "@/views/launcher-readingclub/main-comp/english-library/english-library-keyword/english-library-keyword-main.vue"
          ),
      },
      {
        path: "publisher",
        name: "englishLibraryPublisher",
        component: () =>
          import(
            /* webpackChunkName: "englishLibraryPublisher" */ "@/views/launcher-readingclub/main-comp/english-library/english-library-publisher/english-library-publisher-main.vue"
          ),
      },
    ],
  },
  {
    path: "/english-library/search",
    name: "englishLibrarySearch",
    component: () =>
      import(
        /* webpackChunkName: "englishLibrarySearch" */ "@/views/launcher-readingclub/main-comp/english-library/comp/english-library-search.vue"
      ),
  },
  {
    path: "/english-library/sub/",
    name: "englishLibrarySub",
    component: () =>
      import(
        /* webpackChunkName: "englishLibrarySub" */ "@/views/launcher-readingclub/main-comp/english-library/comp/english-library-sub.vue"
      ),
  },
];
