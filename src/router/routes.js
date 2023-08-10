import MainLayout from 'layouts/MainLayout.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: 'wordforms',
        component: () => import('pages/WordformsPage.vue'),
        meta: { pageTitle: 'Wordforms' }
      },
      {
        path: 'sets',
        component: () => import('pages/SetsPage.vue'),
        meta: { pageTitle: 'Sets' }
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
