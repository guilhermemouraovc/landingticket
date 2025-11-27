<template>
  <section class="banner-card-section">
    <div class="banner-card-wrap">
      <q-card class="banner-card" flat>
        <q-img
          :src="bannerImage"
          v-bind="bannerRatio ? { ratio: bannerRatio } : {}"
          :fit="imageFit"
          spinner-color="primary"
          loading="lazy"
          class="banner-img"
        >
          <!-- Overlay opcional com conteúdo -->
          <div v-if="showOverlay" class="banner-overlay">
            <div class="banner-content">
              <h2 v-if="title" class="banner-title">{{ title }}</h2>
              <p v-if="subtitle" class="banner-subtitle">{{ subtitle }}</p>
              <q-btn
                v-if="ctaLabel"
                :label="ctaLabel"
                color="warning"
                text-color="black"
                unelevated
                no-caps
                class="banner-cta"
                :to="ctaLink"
              />
            </div>
          </div>
        </q-img>
      </q-card>
    </div>
  </section>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { computed } from 'vue'

const $q = useQuasar()

const props = defineProps({
  image: {
    type: String,
    required: true,
    default: 'https://via.placeholder.com/1920x400',
  },
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  ctaLabel: {
    type: String,
    default: '',
  },
  ctaLink: {
    type: [String, Object],
    default: '',
  },
  showOverlay: {
    type: Boolean,
    default: false,
  },
  clickable: {
    type: Boolean,
    default: false,
  },
})

const imageFit = computed(() => {
  return $q.screen.lt.sm ? 'contain' : 'cover'
})

const bannerImage = computed(() => {
  if ($q.screen.lt.sm) {
    return '/SEMJUROS_MOBILEGRANDE.png'
  }
  return props.image
})

const bannerRatio = computed(() => {
  // No mobile, não usar ratio fixo para que a imagem use seu tamanho natural
  return $q.screen.lt.sm ? undefined : 1920 / 200
})
</script>

<style scoped>
.banner-card-section {
  background-color: #2a3447;
  padding: 20px 0;
  overflow: hidden; /* Previne overflow horizontal */
}

.banner-card-wrap {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 0 80px;
  box-sizing: border-box;
  background-color: #2a3447; /* Garante que o wrap também tenha o background correto */
}

.banner-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  width: 100%; /* Garante que o card não ultrapasse o container */
  max-width: 100%; /* Previne overflow */
  background-color: #2a3447 !important; /* Remove o background branco padrão do q-card */
  cursor: default; /* Indica que não é clicável */
}

/* Banner não é mais clicável - estilos de hover removidos */

.banner-img {
  width: 100%;
  max-width: 100%; /* Previne que a imagem ultrapasse */
  min-height: 200px;
  display: block; /* Remove espaços inline */
}

.banner-img :deep(.q-img__container) {
  width: 100% !important;
  max-width: 100% !important;
}

.banner-img :deep(img) {
  width: 100%;
  max-width: 100%;
  height: auto;
  object-fit: cover; /* Ajusta a imagem mantendo proporção */
  display: block;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.1) 100%
  );
  display: flex;
  align-items: center;
  padding: 0 60px;
}

.banner-content {
  max-width: 600px;
}

.banner-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 42px;
  color: white;
  margin: 0 0 16px 0;
  line-height: 1.2;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.banner-subtitle {
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: 18px;
  color: white;
  margin: 0 0 24px 0;
  line-height: 1.5;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.banner-cta {
  height: 48px;
  min-width: 160px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
}

/* Mobile */
@media (max-width: 599px) {
  .banner-card-section {
    padding: 10px 0;
    overflow: hidden; /* Previne overflow no mobile */
  }

  .banner-card-wrap {
    padding: 0 16px;
    max-width: 100%; /* Garante que não ultrapasse a viewport */
  }

  .banner-card {
    max-width: 100%; /* Garante que o card não ultrapasse */
  }

  .banner-img {
    min-height: auto;
    height: auto;
    max-width: 100%;
    width: 100%;
  }

  .banner-img :deep(.q-img__container) {
    height: auto !important;
    width: 100% !important;
    max-width: 100% !important;
  }

  .banner-img :deep(img) {
    width: 100%;
    max-width: 100%;
    height: auto;
    object-fit: contain; /* No mobile, usa contain para mostrar a imagem inteira */
    display: block;
  }

  .banner-overlay {
    padding: 0 16px;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.1) 0%,
      rgba(0, 0, 0, 0.7) 60%,
      rgba(0, 0, 0, 0.8) 100%
    );
    align-items: flex-end;
    padding-bottom: 30px;
  }

  .banner-content {
    width: 100%;
    max-width: 100%;
  }

  .banner-title {
    font-size: 22px;
    word-wrap: break-word; /* Quebra palavras longas */
    overflow-wrap: break-word;
  }

  .banner-subtitle {
    font-size: 13px;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  .banner-cta {
    width: 100%;
    height: 44px;
    font-size: 14px;
  }
}

/* Tablet */
@media (min-width: 600px) and (max-width: 1023px) {
  .banner-card-section {
    overflow: hidden; /* Previne overflow no tablet */
  }

  .banner-card-wrap {
    padding: 0 40px;
    max-width: 100%;
  }

  .banner-card {
    max-width: 100%;
  }

  .banner-img {
    max-width: 100%;
  }

  .banner-img :deep(.q-img__container) {
    max-width: 100% !important;
  }

  .banner-img :deep(img) {
    max-width: 100%;
    object-fit: cover;
  }

  .banner-overlay {
    padding: 0 40px;
  }

  .banner-title {
    font-size: 28px;
    word-wrap: break-word;
  }

  .banner-subtitle {
    font-size: 15px;
    word-wrap: break-word;
  }
}

/* Desktop médio */
@media (min-width: 1024px) and (max-width: 1439px) {
  .banner-card-section {
    overflow: hidden; /* Previne overflow no desktop médio */
  }

  .banner-card-wrap {
    padding: 0 40px;
    max-width: 100%;
  }

  .banner-card {
    max-width: 100%;
  }

  .banner-img {
    max-width: 100%;
  }

  .banner-img :deep(.q-img__container) {
    max-width: 100% !important;
  }

  .banner-img :deep(img) {
    max-width: 100%;
    object-fit: cover;
  }

  .banner-overlay {
    padding: 0 40px;
  }

  .banner-title {
    font-size: 32px;
    word-wrap: break-word;
  }

  .banner-subtitle {
    font-size: 16px;
    word-wrap: break-word;
  }
}

/* Desktop grande - ajuste para telas muito largas */
@media (min-width: 1440px) {
  .banner-card-section {
    overflow: hidden;
  }

  .banner-card-wrap {
    max-width: 1760px; /* Mantém o max-width original mas com proteção */
  }

  .banner-img :deep(img) {
    object-fit: cover;
  }
}
</style>
