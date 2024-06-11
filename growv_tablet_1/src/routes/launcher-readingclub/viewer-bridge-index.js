export default [
  {
    path: '/viewer-bridge/kind',
    name: 'viewBridgeKind',
    component: () => import('@/views/launcher-readingclub/main-comp/viewer-bridge/viewer-bridge-kind.vue')
  },
  {
    path: '/viewer-bridge/report',
    name: 'viewBridgeReport',
    component: () => import('@/views/launcher-readingclub/main-comp/viewer-bridge/viewer-bridge-report.vue')
  },
  {
    path: '/viewer-bridge/read',
    name: 'viewBridgeRead',
    component: () => import('@/views/launcher-readingclub/main-comp/viewer-bridge/viewer-bridge-read.vue')
  },
  {
    path: '/viewer-bridge/quiz',
    name: 'viewBridgeQuiz',
    component: () => import('@/views/launcher-readingclub/main-comp/viewer-bridge/viewer-bridge-quiz.vue')
  }
]
