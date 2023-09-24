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
        path: 'wordform-:wordform_id',
        component: () => import('pages/WordformPage.vue'),
        meta: { pageTitle: 'Wordform' }
      },
      {
        path: 'sets',
        component: () => import('pages/SetsPage.vue'),
        meta: { pageTitle: 'Sets' }
      },
      {
        path: 'set-:set_id',
        component: () => import('pages/SetsPage.vue'),
        meta: { pageTitle: 'Set' }
      },
      {
        path: 'lemmas',
        component: () => import('pages/LemmasPage.vue'),
        meta: { pageTitle: 'Lemmas' }
      },
      {
        path: 'lemma-:lemma_id',
        component: () => import('pages/LemmaPage.vue'),
        meta: { pageTitle: 'Lemma' }
      },
      {
        path: 'training',
        component: () => import('pages/TrainingPage.vue'),
        meta: { pageTitle: 'Training' }
      },
      {
        path: 'prediction',
        component: () => import('pages/PredictionPage.vue'),
        meta: { pageTitle: 'Prediction' }
      },
      {
        path: 'books',
        component: () => import('pages/BooksPage.vue'),
        meta: { pageTitle: 'Books' }
      },
      {
        path: 'chapter-:chapter_id',
        component: () => import('pages/ChapterPage.vue'),
        meta: { pageTitle: 'Chapter' }
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
