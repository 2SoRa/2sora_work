export default [
  {
    path: '/superpick',
    name: 'superpickMain',
    component: () => import(/* webpackChunkName: "superpickMain" */'@/views/launcher-readingclub/main-comp/superpick/superpick-main'),
  },
]
