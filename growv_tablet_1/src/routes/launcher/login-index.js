import {createRouter, createWebHashHistory} from 'vue-router';
import moduleJoin from '@/routes/launcher/join-index'

export default createRouter({
    history: createWebHashHistory(),
    scrollBehavior() {
        return {top: 0}
    },

    routes: [
        {
            path: '/',
            name: 'loginApp',
            component: () => import(/* webpackChunkName: "loginApp" */'@/views/launcher/auth/login/login-app'),
            children: [
                {
                    path: '',
                    name: 'loginGuide',
                    component: () => import(/* webpackChunkName: "loginGuide" */'@/views/launcher/auth/login/comp/login-guide'),
                },
                {
                    path: 'login',
                    name: 'loginMain',
                    component: () => import(/* webpackChunkName: "login" */'@/views/launcher/auth/login/comp/login'),
                },
                {
                    path: 'searchId',
                    name: 'searchId',
                    component: () => import(/* webpackChunkName: "searchId" */'@/views/launcher/auth/login/comp/search-id'),
                },
                {
                    path: 'searchIdSuccess',
                    name: 'searchIdSuccess',
                    component: () => import(/* webpackChunkName: "searchIdSuccess" */'@/views/launcher/auth/login/comp/search-id-success'),
                    props: true,
                },
                {
                    path: 'searchPw',
                    name: 'searchPw',
                    component: () => import(/* webpackChunkName: "searchPw" */'@/views/launcher/auth/login/comp/search-pw'),
                },
                {
                    path: 'resetPw',
                    name: 'resetPw',
                    component: () => import(/* webpackChunkName: "resetPw" */'@/views/launcher/auth/login/comp/reset-pw'),
                    props: true,
                },
                {
                    path: 'loginFail',
                    name: 'loginFail',
                    component: () => import(/* webpackChunkName: "loginFail" */'@/views/launcher/auth/login/comp/login-fail'),
                },
                // {
                //   path: '/loginSuccess',
                //   name: 'loginSuccess',
                //   component: () => import(/!* webpackChunkName: "loginSuccess" *!/'@/views/launcher/auth/login/comp/login-success')
                // }
                ...moduleJoin
            ]
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
});
