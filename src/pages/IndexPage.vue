<template>
  <!-- sem text-white aqui -->
  <q-page class="bg-landing">

    <!-- EVENTOS EM DESTAQUE -->
<!-- EVENTOS EM DESTAQUE -->
<section class="destaque">
  <q-carousel
    v-model="activeSlide"
    animated
    infinite
    swipeable
    autoplay
    arrows
    height="440px"
    control-color="white"
    navigation
    navigation-position="bottom"
    transition-prev="slide-right"
    transition-next="slide-left"
    class="featured-carousel"
  >
    <q-carousel-slide
      v-for="ev in featured"
      :key="ev.id"
      :name="ev.id"
      class="q-pa-none"
    >
      <div class="featured-wrap">
        <div class="featured-grid rounded-borders overflow-hidden shadow-2">

          <!-- Imagem à esquerda (estável) -->
          <div class="featured-img">
            <q-img
              :src="ev.image"
              fit="cover"
              class="full"
              :ratio="16/9"   
              spinner-color="white"
            />
          </div>

          <!-- Painel branco à direita (flex + altura total) -->
          <div class="featured-panel">
            <div class="panel-inner">
              <div class="text-h5 text-weight-bold q-mb-sm">{{ ev.title }}</div>

              <div class="q-mt-md q-gutter-sm">
                <div class="row items-center text-grey-8">
                  <q-icon name="event" class="q-mr-sm" />
                  <span class="text-body2">{{ ev.date }}</span>
                </div>
                <div class="row items-center text-grey-8">
                  <q-icon name="place" class="q-mr-sm" />
                  <span class="text-body2">{{ ev.location }}</span>
                </div>
              </div>

              <q-btn
                class="q-mt-lg"
                color="warning"
                text-color="black"
                unelevated
                rounded
                label="Ver Detalhes"
                :to="ev.link || '#'"
              />
            </div>
          </div>

        </div>
      </div>
    </q-carousel-slide>
  </q-carousel>
</section>
<!-- CATEGORIAS -->
<section class="categories">
  <div class="categories-wrap">
    <div class="cat-grid">
      <q-btn
        v-for="c in categories"
        :key="c.label"
        outline
        rounded
        no-caps
        class="cat-btn"
        color="white"
        text-color="white"
        :icon="c.icon"
        :label="c.label"
      />
    </div>
  </div>
</section>


  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const activeSlide = ref('carvalheira')

const featured = ref([
  {
    id: 'carvalheira',
    title: 'Carvalheira na Ladeira 2026',
    date: '14 FEV → 17 FEV',
    location: 'Parque Memorial Arcoverde, Olinda - PE',
    image: 'https://i.postimg.cc/LXsvvLvy/Captura-de-tela-2025-09-24-114525.png',
    link: '#'
  },
  {
    id: 'amore',
    title: 'Reveillon Amoré',
    date: '26 DEZ → 31 DEZ',
    location: 'Praia de Maracaípe, Ipojuca-PE',
    image: 'https://i.postimg.cc/tRBJLPk5/Captura-de-tela-2025-09-26-163619.png',
    link: '#'
  }
])
/* categorias (ícones do Material) */
const categories = ref([
  { label: 'Carnaval',     icon: 'celebration' },
  { label: 'São João',     icon: 'park' },
  { label: 'Semana Santa', icon: 'holiday_village' },
  { label: 'Ano Novo',     icon: 'auto_awesome' },
  { label: 'Boate',        icon: 'nightlife' },
  { label: 'Calourada',    icon: 'school' },

  { label: 'Ano Novo',     icon: 'auto_awesome' },
])
</script>

<style scoped>
/* fundo da página */
.bg-landing {
  background-color: #2A3447;
  min-height: 100vh;
}

/* seção dos destaques (mantém o respiro) */
.destaque {
  background-color: #2A3447;
  padding: 40px 0;
}

/* carrossel sem branco */
.featured-carousel { background: transparent !important; }
.featured-carousel .q-carousel__slide {
  display: flex;
  align-items: center;
}

/* wrapper com 80px de margem lateral (1920 → 1760px úteis) */
.featured-wrap {
  width: calc(100vw - 160px);
  max-width: 1760px;
  height: 440px;
  margin: 0 auto;
}

/* card 1280x440 com curva */
.featured-grid {
  display: grid;
  grid-template-columns: 60% 40%;
  height: 100%;
  background: #fff;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,.2);
}

/* imagem cobre tudo */
.featured-img, .featured-img .full { width: 100%; height: 100%; }
.featured-img .full img { object-fit: cover; }

/* painel à direita */
.featured-panel {
  background: #fff;
  color: #1f2937;
  display: flex;
}
/* força cores escuras no painel (se algo herdar text-white) */
.featured-panel, .featured-panel * { color: #1f2937 !important; }

.panel-inner {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  padding: 28px;
  width: 100%;
  min-height: 100%;
}

/* bullets */
.featured-carousel .q-carousel__navigation { bottom: 8px; }
.featured-carousel .q-carousel__navigation .q-btn { opacity: .85; }
/* ===================== CATEGORIAS ===================== */
.categories {
  background-color: #2A3447;
  margin-top: 100px;                 /* distância ao destaque */
  padding-bottom: 40px;              /* respiro inferior */
}

.categories-wrap {
  width: calc(100vw - 160px);        /* 80px de cada lado */
  max-width: 1760px;
  margin: 0 auto;
}

/* grid com duas linhas, alinhado igual ao Figma */
.cat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20.23px; /* distância exata entre botões */
  justify-content: center;
}

/* botão outline 168x48 */
.cat-btn {
  height: 46.79px;      /* altura exata do Figma */
  min-width: 168.76px;  /* largura exata do Figma */
  font-weight: 600;
}
.cat-btn:hover {
  background: rgba(255,255,255,.08);
  border-color: #ffffff !important;
}

/* texto/ícone */
.cat-btn .q-btn__content { font-weight: 700; letter-spacing: .3px; }
.cat-btn .q-icon { margin-right: 8px; }

/* responsivo básico */
@media (max-width: 1366px) {
  .cat-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}
@media (max-width: 1024px) {
  .featured-wrap { height: 620px; }
  .featured-grid { grid-template-columns: 1fr; }
  .cat-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media (max-width: 640px) {
  .cat-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
</style>
