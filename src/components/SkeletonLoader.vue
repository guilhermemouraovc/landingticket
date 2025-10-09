<template>
  <div class="skeleton-loader" :class="[`skeleton-loader--${variant}`]">
    <!-- Skeleton para cards de eventos -->
    <div v-if="variant === 'event-card'" class="skeleton-event-card">
      <div class="skeleton-image"></div>
      <div class="skeleton-body">
        <div class="skeleton-title"></div>
        <div class="skeleton-text skeleton-text--short"></div>
        <div class="skeleton-text skeleton-text--shorter"></div>
      </div>
    </div>

    <!-- Skeleton para hero/carousel -->
    <div v-else-if="variant === 'hero'" class="skeleton-hero">
      <div class="skeleton-hero-image"></div>
      <div class="skeleton-hero-content">
        <div class="skeleton-hero-title"></div>
        <div class="skeleton-text"></div>
        <div class="skeleton-text"></div>
        <div class="skeleton-button"></div>
      </div>
    </div>

    <!-- Skeleton para lista (múltiplos cards) -->
    <div v-else-if="variant === 'list'" class="skeleton-list">
      <div v-for="i in count" :key="i" class="skeleton-event-card">
        <div class="skeleton-image"></div>
        <div class="skeleton-body">
          <div class="skeleton-title"></div>
          <div class="skeleton-text skeleton-text--short"></div>
          <div class="skeleton-text skeleton-text--shorter"></div>
        </div>
      </div>
    </div>

    <!-- Skeleton para carrossel horizontal -->
    <div v-else-if="variant === 'carousel'" class="skeleton-carousel">
      <div class="skeleton-carousel-header">
        <div class="skeleton-carousel-title"></div>
        <div class="skeleton-carousel-nav"></div>
      </div>
      <div class="skeleton-carousel-items">
        <div v-for="i in carouselCount" :key="i" class="skeleton-event-card">
          <div class="skeleton-image"></div>
          <div class="skeleton-body">
            <div class="skeleton-title"></div>
            <div class="skeleton-text skeleton-text--short"></div>
            <div class="skeleton-text skeleton-text--shorter"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  // Tipo de skeleton: 'event-card', 'hero', 'list', 'carousel'
  variant: {
    type: String,
    default: 'event-card',
    validator: (value) => ['event-card', 'hero', 'list', 'carousel'].includes(value),
  },

  // Número de itens (usado em list e carousel)
  count: {
    type: Number,
    default: 3,
  },

  // Número de itens no carousel
  carouselCount: {
    type: Number,
    default: 4,
  },
})
</script>

<style scoped>
/* ==================== ANIMAÇÃO ==================== */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton-loader {
  width: 100%;
}

/* Base para elementos skeleton */
.skeleton-image,
.skeleton-title,
.skeleton-text,
.skeleton-button,
.skeleton-hero-image,
.skeleton-hero-title,
.skeleton-hero-content,
.skeleton-carousel-title,
.skeleton-carousel-nav {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
  border-radius: 8px;
}

/* ==================== EVENT CARD ==================== */
.skeleton-event-card {
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.03);
  overflow: hidden;
  flex: 0 0 320px;
  width: 320px;
}

.skeleton-image {
  width: 100%;
  height: 220px;
  border-radius: 0;
}

.skeleton-body {
  padding: 20px 22px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-title {
  width: 80%;
  height: 24px;
}

.skeleton-text {
  width: 100%;
  height: 16px;
}

.skeleton-text--short {
  width: 70%;
}

.skeleton-text--shorter {
  width: 50%;
}

/* ==================== HERO ==================== */
.skeleton-hero {
  display: grid;
  grid-template-columns: 60% 40%;
  height: 440px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 32px;
  overflow: hidden;
}

.skeleton-hero-image {
  width: 100%;
  height: 100%;
  border-radius: 0;
}

.skeleton-hero-content {
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
}

.skeleton-hero-title {
  width: 90%;
  height: 48px;
}

.skeleton-button {
  width: 140px;
  height: 44px;
  margin-top: 16px;
}

/* ==================== LIST ==================== */
.skeleton-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.skeleton-list .skeleton-event-card {
  flex: unset;
  width: 100%;
}

/* ==================== CAROUSEL ==================== */
.skeleton-carousel {
  margin-top: 56px;
}

.skeleton-carousel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.skeleton-carousel-title {
  width: 200px;
  height: 32px;
}

.skeleton-carousel-nav {
  width: 100px;
  height: 40px;
}

.skeleton-carousel-items {
  display: flex;
  gap: 24px;
  overflow: hidden;
}

/* ==================== RESPONSIVIDADE ==================== */
@media (max-width: 768px) {
  .skeleton-hero {
    grid-template-columns: 1fr;
    height: 600px;
  }

  .skeleton-hero-content {
    padding: 24px;
  }

  .skeleton-list {
    grid-template-columns: 1fr;
  }

  .skeleton-event-card {
    flex: 0 0 280px;
    width: 280px;
  }
}
</style>
