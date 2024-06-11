import {createRouter, createWebHashHistory} from 'vue-router';

export default createRouter({
    history: createWebHashHistory(),
    scrollBehavior() {
        return {top: 0}
    },

    routes: [
        {
            path: '/',
            name: 'MypageApp',
            component: () => import(/* webpackChunkName: "MypageApp" */'@/views/launcher/mypage/mypage-app'),
            children: [
                {
                    path: '',
                    name: 'MypageContsApp',
                    component: () => import(/* webpackChunkName: "MypageContsApp" */'@/views/launcher/mypage/comp/contents-app'),
                    children: [
                        {
                            path: '',
                            name: 'VitaminHistory',
                            component: () => import(/* webpackChunkName: "VitaminHistory" */'@/views/launcher/mypage/comp/comp-contents/vitamin-history'),
                        },
                        {
                            path: 'member-info',
                            name: 'MemberInfo',
                            component: () => import(/* webpackChunkName: "MemberInfo" */'@/views/launcher/mypage/comp/comp-contents/modi-member-info/modi-member-info-app'),
                            children: [
                                {
                                    path: '',
                                    name: 'MemberInfoMain',
                                    component: () => import(/* webpackChunkName: "MemberInfo" */'@/views/launcher/mypage/comp/comp-contents/modi-member-info/member-info-main'),
                                },
                                {
                                    path: 'info-modify/:id',
                                    name: 'MemberInfoModify',
                                    component: () => import(/* webpackChunkName: "MemberInfo" */'@/views/launcher/mypage/comp/comp-contents/modi-member-info/info-modify'),
                                    props: true,
                                }
                            ]
                        },
                        {
                            path: 'message-box',
                            name: 'MessageBoxApp',
                            component: () => import(/* webpackChunkName: "MessageBoxApp" */'@/views/launcher/mypage/comp/comp-contents/message-box/message-box-app'),
                            children: [
                                {
                                    path: '',
                                    name: 'MessageReceive',
                                    component: () => import(/* webpackChunkName: "MessageReceive" */'@/views/launcher/mypage/comp/comp-contents/message-box/receive'),
                                },
                                {
                                    path: 'send',
                                    name: 'MessageSend',
                                    component: () => import(/* webpackChunkName: "MessageSend" */'@/views/launcher/mypage/comp/comp-contents/message-box/send'),
                                },
                            ],
                        },
                        {
                            path: 'study-support',
                            name: 'StudySupportApp',
                            component: () => import(/* webpackChunkName: "StudySupportApp" */'@/views/launcher/mypage/comp/comp-contents/study-support/study-support-app'),
                            children: [
                                {
                                    path: '',
                                    name: 'StudySupportNotice',
                                    component: () => import(/* webpackChunkName: "StudySupportNotice" */'@/views/launcher/mypage/comp/comp-contents/study-support/notice'),
                                },
                                {
                                    path: 'faq',
                                    name: 'StudySupportFaq',
                                    component: () => import(/* webpackChunkName: "StudySupportFaq" */'@/views/launcher/mypage/comp/comp-contents/study-support/faq'),
                                },
                                {
                                    path: 'consult',
                                    name: 'StudySupportConsult',
                                    component: () => import(/* webpackChunkName: "StudySupportConsult" */'@/views/launcher/mypage/comp/comp-contents/study-support/consult'),
                                },
                            ],
                        },
                    ],
                },
            ]
        },
        {
            path: '/reply-message',
            name: 'ReplyMessage',
            component: () => import(/* webpackChunkName: "ReplyMessage" */'@/views/launcher/mypage/comp-mypage-link/reply-message'),
        },
        {
            path: '/send-message',
            name: 'SendMessage',
            component: () => import(/* webpackChunkName: "SendMessage" */'@/views/launcher/mypage/comp-mypage-link/send-message'),
        },
        {
            path: '/message-received',
            name: 'MessageReceived',
            component: () => import(/* webpackChunkName: "MessageReceived" */'@/views/launcher/mypage/comp-mypage-link/message-recived'),
        },
        {
            path: '/message-sent',
            name: 'MessageSent',
            component: () => import(/* webpackChunkName: "MessageSent" */'@/views/launcher/mypage/comp-mypage-link/message-sent'),
        },
        {
            path: '/notice-view/:id',
            name: 'noticeView',
            component: () => import(/* webpackChunkName: "noticeView" */'@/views/launcher/mypage/comp-mypage-link/notice-view'),
            props: true,
        },
        {
            path: '/faq-view/:id',
            name: 'faqView',
            component: () => import(/* webpackChunkName: "faqView" */'@/views/launcher/mypage/comp-mypage-link/faq-view'),
            props: true,
        },
        {
            path: '/consult-view/:id',
            name: 'consultView',
            component: () => import(/* webpackChunkName: "consultView" */'@/views/launcher/mypage/comp-mypage-link/consult-view'),
            props: true,
        },
        {
            path: '/consult-write',
            name: 'consultWrite',
            component: () => import(/* webpackChunkName: "consultWrite" */'@/views/launcher/mypage/comp-mypage-link/consult-write'),
        },
        {
            path: '/attend-book',
            name: 'AttendBook',
            component: () => import(/* webpackChunkName: "AttentBook" */'@/views/launcher/mypage/comp-mypage-link/attend-book'),
        },
        {
            path: '/allReissue',
            name: 'allReissue',
            component: () => import(/* webpackChunkName: "allReissue" */'@/views/launcher/mypage/comp-mypage-link/all-reissue.vue'),
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
})
