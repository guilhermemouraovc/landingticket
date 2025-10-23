const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: 'event/:id',
        name: 'event-detail',
        component: () => import('pages/EventDetailPage.vue'),
      },
      {
        path: 'programacao',
        name: 'programacao-completa',
        component: () => import('pages/ProgramacaoCompletaPage.vue'),
      },
      {
        path: 'reveillon',
        name: 'reveillon',
        component: () => import('pages/ReveillonPage.vue'),
      },
      {
        path: 'carnaval',
        name: 'carnaval',
        component: () => import('pages/CarnavalPage.vue'),
      },
      {
        path: 'festivais',
        name: 'festivais',
        component: () => import('pages/FestivaisPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
