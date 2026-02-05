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
/* ==================== BRUTAL BANNER CARD ==================== */
.banner-card-section {
  background-color: #2a3447;
  padding: 24px 0;
  overflow: hidden;
}

.banner-card-wrap {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 0 80px;
  box-sizing: border-box;
  background-color: #2a3447;
}

.banner-card {
  border-radius: 0 !important;
  overflow: hidden;
  border: 3px solid #1a1a1a;
  box-shadow: 8px 8px 0px #1a1a1a;
  width: 100%;
  max-width: 100%;
  background-color: #2a3447 !important;
  cursor: default;
  transition: all 0.15s ease;
}

.banner-img {
  width: 100%;
  max-width: 100%;
  min-height: 200px;
  display: block;
}

.banner-img :deep(.q-img__container) {
  width: 100% !important;
  max-width: 100% !important;
  border-radius: 0 !important;
}

.banner-img :deep(img) {
  width: 100%;
  max-width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
  border-radius: 0 !important;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.4) 50%,
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
  font-weight: 800;
  font-size: 42px;
  color: #fafafa;
  margin: 0 0 16px 0;
  line-height: 1.1;
  text-transform: uppercase;
  letter-spacing: -1px;
}

.banner-subtitle {
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 18px;
  color: #fafafa;
  margin: 0 0 24px 0;
  line-height: 1.5;
}

.banner-cta {
  height: 52px;
  min-width: 180px;
  border-radius: 0 !important;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 3px solid #1a1a1a !important;
  box-shadow: 4px 4px 0px #1a1a1a;
  transition: all 0.15s ease;
}

.banner-cta:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px #1a1a1a;
}

.banner-cta:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #1a1a1a;
}

/* ==================== RESPONSIVE - BRUTAL ==================== */
/* Mobile */
@media (max-width: 599px) {
  .banner-card-section {
    padding: 16px 0;
    overflow: hidden;
  }

  .banner-card-wrap {
    padding: 0 16px;
    max-width: 100%;
  }

  .banner-card {
    max-width: 100%;
    box-shadow: 5px 5px 0px #1a1a1a;
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
    object-fit: contain;
    display: block;
  }

  .banner-overlay {
    padding: 0 16px;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.1) 0%,
      rgba(0, 0, 0, 0.7) 60%,
      rgba(0, 0, 0, 0.85) 100%
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
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  .banner-subtitle {
    font-size: 13px;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  .banner-cta {
    width: 100%;
    height: 48px;
    font-size: 14px;
    box-shadow: 3px 3px 0px #1a1a1a;
  }
}

/* Tablet */
@media (min-width: 600px) and (max-width: 1023px) {
  .banner-card-section {
    overflow: hidden;
  }

  .banner-card-wrap {
    padding: 0 40px;
    max-width: 100%;
  }

  .banner-card {
    max-width: 100%;
    box-shadow: 6px 6px 0px #1a1a1a;
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
    overflow: hidden;
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

/* Desktop grande */
@media (min-width: 1440px) {
  .banner-card-section {
    overflow: hidden;
  }

  .banner-card-wrap {
    max-width: 1760px;
  }

  .banner-img :deep(img) {
    object-fit: cover;
  }
}
</style>
