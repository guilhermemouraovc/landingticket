<template>
  <div class="page-header">
    <BackButton :use-history="useHistory" :to="backTo" />

    <!-- Título centralizado -->
    <div class="page-title">{{ title }}</div>

    <!-- Linha divisória -->
    <div class="title-divider" :class="{ 'title-divider--gradient': useGradient }"></div>
  </div>
</template>

<script setup>
import BackButton from './BackButton.vue'

defineProps({
  title: {
    type: String,
    required: true,
  },
  useHistory: {
    type: Boolean,
    default: false,
  },
  backTo: {
    type: [String, Object],
    default: '/',
  },
  useGradient: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.page-header {
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  position: relative;
}

/* Desktop: Botão de voltar alinhado à esquerda */
@media (min-width: 600px) {
  .page-header {
    align-items: flex-start;
  }

  .page-header :deep(.back-button-container) {
    align-self: flex-start;
    margin-left: 0;
  }

  .page-title {
    align-self: center;
    width: 100%;
  }

  .title-divider {
    align-self: center;
  }
}

.page-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 600; /* semibold */
  font-size: 32px;
  color: #fff;
  text-align: center;
}

.title-divider {
  width: 100%;
  max-width: 1440px;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.2);
  margin: 0 auto;
}

.title-divider--gradient {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 20%,
    rgba(255, 255, 255, 0.3) 80%,
    transparent 100%
  );
}

/* Responsividade mobile */
@media (max-width: 599px) {
  .page-header {
    padding: 20px 0;
    gap: 12px;
    align-items: center;
    position: relative;
  }

  .page-header :deep(.back-button-container) {
    align-self: flex-start;
    margin-left: 0;
  }

  .page-title {
    font-size: 28px;
    width: 100%;
    text-align: center;
  }
}
</style>
