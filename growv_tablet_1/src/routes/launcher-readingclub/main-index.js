import { createWebHashHistory, createRouter } from "vue-router";
import moduleSuperpick from "@/routes/launcher-readingclub/superpick-index";
import moduleMypage from "@/routes/launcher-readingclub/mypage-index";
import moduleKoreanLibrary from "@/routes/launcher-readingclub/koreanl-library-index";
import moduleReadingStatus from "@/routes/launcher-readingclub/reading-status-index";
import moduleMyLibrary from "@/routes/launcher-readingclub/my-library-index";
import moduleMyTree from "@/routes/launcher-readingclub/my-tree-index";
import moduleMySuperBook from "@/routes/launcher-readingclub/mysuperbook-index";
import moduleEnglishLibrary from "@/routes/launcher-readingclub/english-library-index";
import moduleViewerBridge from "@/routes/launcher-readingclub/viewer-bridge-index";
import moduleVscan from "@/routes/launcher-readingclub/vscan-index";
import moduleSearch from "@/routes/launcher-readingclub/vscan-search-index";

// guide 내부 에셋 확인용
import guideComponent from "@/routes/guide-component-index";

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior() {
    return { top: 0 };
  },

  routes: [
    {
      path: "/",
      name: "ReadingClubMainApp",
      component: () =>
        import(
          /* webpackChunkName: "ReadingClubMainApp" */ "@/views/launcher-readingclub/readingclub-main-app"
        ),
      children: [
        {
          path: "",
          name: "ReadingClubMainView",
          component: () =>
            import(
              /* webpackChunkName: "ReadingClubMainView" */ "@/views/launcher-readingclub/main-comp/main-contents"
            ),
        },
      ],
    },
    ...moduleSuperpick,
    ...moduleMypage,
    ...moduleKoreanLibrary,
    ...moduleReadingStatus,
    ...moduleMyLibrary,
    ...moduleMyTree,
    ...moduleMySuperBook,
    ...moduleEnglishLibrary,
    ...moduleViewerBridge,
    ...moduleVscan,
    ...moduleSearch,
    ...guideComponent
  ],
});

import store from "@/store";
router.afterEach((from) => {
  if (from.query.menu) {
    store.commit('readingStorage/setAllMenu',true)
  }
  /* 출석 체크 */
  setTimeout(() => {
    store.dispatch('readingStorage/setAttend');
  },500);
});
// 빌드중 라우팅 처리
router.onError((error) => {
  if (error.name === 'ChunkLoadError') {
    window.location.reload();
  }
})

export default router;









