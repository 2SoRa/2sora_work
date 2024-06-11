export default [
  {
    path: "/mypage",
    name: "mypageApp",
    component: () =>
      import(
        /* webpackChunkName: "mypageApp" */ "@/views/launcher-readingclub/main-comp/mypage/mypage-app.vue"
      ),
    children: [
      {
        path: "",
        name: "mypageMain",
        component: () =>
          import(
            /* webpackChunkName: "mypageMain" */ "@/views/launcher-readingclub/main-comp/mypage/comp/contents-app.vue"
          ),
        children: [
          {
            path: "grow-tree",
            name: "GrowingTree",
            component: () =>
              import(
                /* webpackChunkName: "GrowingTree" */ "@/views/launcher-readingclub/main-comp/mypage/comp/comp-contents/growing-tree/growing-tree-main.vue"
              ),
          },
          {
            path: "shopping-point",
            name: "ShoppingPoint",
            component: () =>
              import(
                /* webpackChunkName: "ShoppingPoint" */ "@/views/launcher-readingclub/main-comp/mypage/comp/comp-contents/shopping-point/shopping-point-main.vue"
              ),
          },
          // 런처에서 가져 온 학습지원,회원정보수정
          {
            path: "study-support",
            name: "StudySupportApp",
            component: () =>
              import(
                /* webpackChunkName: "StudySupportApp" */ "@/views/launcher/mypage/comp/comp-contents/study-support/study-support-app"
              ),
            children: [
              {
                path: "",
                name: "StudySupportNotice",
                component: () =>
                  import(
                    /* webpackChunkName: "StudySupportNotice" */ "@/views/launcher/mypage/comp/comp-contents/study-support/notice"
                  ),
              },
              {
                path: "faq",
                name: "StudySupportFaq",
                component: () =>
                  import(
                    /* webpackChunkName: "StudySupportFaq" */ "@/views/launcher/mypage/comp/comp-contents/study-support/faq"
                  ),
              },
              {
                path: "consult",
                name: "StudySupportConsult",
                component: () =>
                  import(
                    /* webpackChunkName: "StudySupportConsult" */ "@/views/launcher/mypage/comp/comp-contents/study-support/consult"
                  ),
              },
            ],
          },
          {
            path: "member-info",
            name: "MemberInfo",
            component: () =>
              import(
                /* webpackChunkName: "MemberInfo" */ "@/views/launcher/mypage/comp/comp-contents/modi-member-info/modi-member-info-app"
              ),
            children: [
              {
                path: "",
                name: "MemberInfoMain",
                component: () =>
                  import(
                    /* webpackChunkName: "MemberInfo" */ "@/views/launcher/mypage/comp/comp-contents/modi-member-info/member-info-main"
                  ),
              },
              {
                path: "info-modify/:id",
                name: "MemberInfoModify",
                component: () =>
                  import(
                    /* webpackChunkName: "MemberInfo" */ "@/views/launcher/mypage/comp/comp-contents/modi-member-info/info-modify"
                  ),
                props: true,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/notice-view/:id",
    name: "noticeView",
    component: () =>
      import(
        /* webpackChunkName: "noticeView" */ "@/views/launcher/mypage/comp-mypage-link/notice-view"
      ),
    props: true,
  },
  {
    path: "/faq-view/:id",
    name: "faqView",
    component: () =>
      import(
        /* webpackChunkName: "faqView" */ "@/views/launcher/mypage/comp-mypage-link/faq-view"
      ),
    props: true,
  },
  {
    path: "/consult-view/:id",
    name: "consultView",
    component: () =>
      import(
        /* webpackChunkName: "consultView" */ "@/views/launcher/mypage/comp-mypage-link/consult-view"
      ),
    props: true,
  },
  {
    path: "/consult-write",
    name: "consultWrite",
    component: () =>
      import(
        /* webpackChunkName: "consultWrite" */ "@/views/launcher/mypage/comp-mypage-link/consult-write"
      ),
  },
  {
    path: "/404",
    name: "notFound",
    component: () => import("@/views/common/not-found"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];
