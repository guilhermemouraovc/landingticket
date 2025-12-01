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
      // Rotas de influenciadoras
      {
        path: 'camila-carvalho',
        name: 'camila-carvalho',
        component: () => import('pages/CamilaCarvalhoPage.vue'),
      },
      {
        path: 'julia-souto',
        name: 'julia-souto',
        component: () => import('pages/JuliaSoutoPage.vue'),
      },
      {
        path: 'joao-clericuzzi',
        name: 'joao-clericuzzi',
        component: () => import('pages/JoaoClericuzziPage.vue'),
      },
      {
        path: 'lauany',
        name: 'lauany',
        component: () => import('pages/LauanyPage.vue'),
      },
      {
        path: 'catalogo',
        name: 'catalogo',
        component: () => import('pages/CatalogoPage.vue'),
      },
      {
        path: 'netinho-soares',
        name: 'netinho-soares',
        component: () => import('pages/NetinhoSoaresPage.vue'),
      },
      {
        path: 'cadu-alencar',
        name: 'cadu-alencar',
        component: () => import('pages/CaduAlencarPage.vue'),
      },
      {
        path: 'tallita-manta',
        name: 'tallita-manta',
        component: () => import('pages/TallitaMantaPage.vue'),
      },
      {
        path: 'hypepe',
        name: 'hypepe',
        component: () => import('pages/HypepePage.vue'),
      },
      {
        path: 'mariana-almeida',
        name: 'mariana-almeida',
        component: () => import('pages/MarianaAlmeidaPage.vue'),
      },
      {
        path: 'tulio-cisneiro',
        name: 'tulio-cisneiro',
        component: () => import('pages/TulioCisneiroPage.vue'),
      },
      {
        path: 'clara-borba',
        name: 'clara-borba',
        component: () => import('pages/ClaraBorbaPage.vue'),
      },
      {
        path: 'maria-eloisa',
        name: 'maria-eloisa',
        component: () => import('pages/MariaEloisaPage.vue'),
      },
      {
        path: 'brenda-neves',
        name: 'brenda-neves',
        component: () => import('pages/BrendaNevesPage.vue'),
      },
      {
        path: 'ricardo-costa',
        name: 'ricardo-costa',
        component: () => import('pages/RicardoCostaPage.vue'),
      },
      {
        path: 'diego-escorel',
        name: 'diego-escorel',
        component: () => import('pages/DiegoEscorelPage.vue'),
      },
      {
        path: 'carlos-oliveira',
        name: 'carlos-oliveira',
        component: () => import('pages/CarlosOliveiraPage.vue'),
      },
      {
        path: 'giovanna-lucena',
        name: 'giovanna-lucena',
        component: () => import('pages/GiovannaLucenaPage.vue'),
      },
      {
        path: 'guilherme-santana',
        name: 'guilherme-santana',
        component: () => import('pages/GuilhermeSantanaPage.vue'),
      },
      {
        path: 'luis-felipe',
        name: 'luis-felipe',
        component: () => import('pages/LuisFelipePage.vue'),
      },
      {
        path: 'eduardo-loyo',
        name: 'eduardo-loyo',
        component: () => import('pages/EduardoLoyoPage.vue'),
      },
      {
        path: 'jao',
        name: 'jao',
        component: () => import('pages/JaoPage.vue'),
      },
      {
        path: 'samuel-brito',
        name: 'samuel-brito',
        component: () => import('pages/SamuelBritoPage.vue'),
      },
      {
        path: 'larissa-balta',
        name: 'larissa-balta',
        component: () => import('pages/LarissaBaltaPage.vue'),
      },
      {
        path: 'luisa-oliveira',
        name: 'luisa-oliveira',
        component: () => import('pages/LuisaOliveiraPage.vue'),
      },
      {
        path: 'bianka-alcantara',
        name: 'bianka-alcantara',
        component: () => import('pages/BiankaAlcantaraPage.vue'),
      },
      {
        path: 'eduarda-teixeira',
        name: 'eduarda-teixeira',
        component: () => import('pages/EduardaTeixeiraPage.vue'),
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
