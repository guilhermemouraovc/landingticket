const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: 'event/:slug',
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
      {
        path: 'termos-de-uso',
        name: 'termos-de-uso',
        component: () => import('pages/TermosDeUsoPage.vue'),
      },
      {
        path: 'politica-de-privacidade',
        name: 'politica-de-privacidade',
        component: () => import('pages/PoliticaPrivacidadePage.vue'),
      },
      {
        path: 'catalogo',
        name: 'catalogo',
        component: () => import('pages/CatalogoPage.vue'),
      },
      {
        path: 'embaixadores',
        name: 'embaixadores',
        component: () => import('pages/EmbaixadoresPage.vue'),
      },
      // Dynamic influencer route - handles all influencer tracking pages
      {
        path: ':slug',
        name: 'influencer',
        component: () => import('pages/InfluencerPage.vue'),
      },
    ],
  },
  // Rotas de autenticação e admin (sem layout principal)
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/LoginPage.vue'),
  },
  {
    path: '/melanciamaluca',
    name: 'admin',
    component: () => import('pages/AdminPage.vue'),
    meta: { requiresAuth: true },
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
