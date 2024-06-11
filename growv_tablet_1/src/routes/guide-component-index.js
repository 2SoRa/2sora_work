export default [
    {
        path: '/guideComponent',
        name: 'guideApp',
        component: () => import(/* webpackChunkName: "myTreeApp" */'@/views/guide_component/assets.vue'),
    }
]
