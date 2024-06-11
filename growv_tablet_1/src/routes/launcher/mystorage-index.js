import { createWebHashHistory, createRouter } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior() {
    return {top: 0}
  },

  routes: [
    {
      path: '/',
      name: 'MyStorageApp',
      component: () => import(/* webpackChunkName: "MyStorageApp" */'@/views/launcher/mystorage/mystorage-app'),
      children : [
        {
          path: '',
          name: 'MyStorageContsApp',
          component: () => import(/* webpackChunkName: "MyStorageContsApp" */'@/views/launcher/mystorage/comp/mystorage-comp-app'),
          children: [
            {
              path: ':subId/:storageId',
              name: 'MyStorageSubject',
              component: () => import(/* webpackChunkName: "MyStorageCurrent" */'@/views/launcher/mystorage/comp/mystorage-subject'),
              props: true,
            },
            {
              path: 'book/:subId/:storageId',
              name: 'MyStorageBook',
              component: () => import(/* webpackChunkName: "MyStorageBook" */'@/views/launcher/mystorage/comp/mystorage-book'),
              props: true,
            }
          ]
        }
      ]
    },
  ]
});

router.onError((error) => {
  if (error.name === 'ChunkLoadError') {
    window.location.reload();
  }
})

export default router;