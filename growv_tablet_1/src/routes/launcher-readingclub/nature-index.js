export default [
  {
    path: "/nature",
    name: "natureMain",
    component: () => import('@/views/launcher-readingclub/main-comp/nature/nature-main')
  },
  {
    path: "/nature/search",
    name: "natureSearch",
    component: () => import('@/views/launcher-readingclub/main-comp/nature/nature-search')
  }
]
