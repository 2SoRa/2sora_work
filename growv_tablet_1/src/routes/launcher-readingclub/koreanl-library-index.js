export default [
  {
    path: '/korean-library',
    name: 'koreanLibraryMain',
    component: () => import(/* webpackChunkName: "koreanLibraryMain" */'@/views/launcher-readingclub/main-comp/korean-library/korean-library-main'),
    children: [
      {
        path: '',
        name: 'koreanLibraryKind',
        component: () => import(/* webpackChunkName: "koreanLibraryKind" */'@/views/launcher-readingclub/main-comp/korean-library/korean-library-kind/korean-library-kind-main'),
      },
      {
        path: 'development',
        name: 'koreanLibraryDevelopment',
        component: () => import(/* webpackChunkName: "koreanLibraryDevelopment" */'@/views/launcher-readingclub/main-comp/korean-library/korean-library-development/korean-library-development-main'),
      },
      {
        path: 'keyword',
        name: 'koreanLibraryKeyword',
        component: () => import(/* webpackChunkName: "koreanLibraryKeyword" */'@/views/launcher-readingclub/main-comp/korean-library/korean-library-keyword/korean-library-keyword-main'),
      },
      {
        path: 'age',
        name: 'koreanLibraryAge',
        component: () => import(/* webpackChunkName: "koreanLibraryAge" */'@/views/launcher-readingclub/main-comp/korean-library/korean-library-age/korean-library-age-main'),
      },
      {
        path: 'publisher',
        name: 'koreanLibraryPublisher',
        component: () => import(/* webpackChunkName: "koreanLibraryPublisher" */'@/views/launcher-readingclub/main-comp/korean-library/korean-library-publisher/korean-library-publisher-main'),
      },
    ],
  },
  {
    path: '/korean-library/search',
    name: 'koreanLibrarySearch',
    component: () => import(/* webpackChunkName: "koreanLibrarySearch" */'@/views/launcher-readingclub/main-comp/korean-library/comp/korean-library-search'),
  },
  {
    path: '/korean-library/sub',
    name: 'koreanLibrarySub',
    component: () => import(/* webpackChunkName: "koreanLibrarySub" */'@/views/launcher-readingclub/main-comp/korean-library/comp/korean-library-sub'),
  },
]
