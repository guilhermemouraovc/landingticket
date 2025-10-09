<template>
  <div class="loading-state" :class="[sizeClass, { 'loading-state--fullscreen': fullscreen }]">
    <div class="loading-content">
      <!-- Spinner -->
      <q-spinner
        v-if="showSpinner"
        :color="spinnerColor"
        :size="spinnerSize"
        :thickness="spinnerThickness"
      />

      <!-- Skeleton Loaders (alternativa ao spinner) -->
      <div v-if="showSkeleton" class="skeleton-container">
        <q-skeleton
          v-for="i in skeletonCount"
          :key="i"
          :type="skeletonType"
          :height="skeletonHeight"
          :width="skeletonWidth"
          class="skeleton-item"
        />
      </div>

      <!-- Mensagem -->
      <div v-if="message" class="loading-message" :style="{ color: messageColor }">
        {{ message }}
      </div>

      <!-- Slot customizável -->
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Mensagem a ser exibida
  message: {
    type: String,
    default: '',
  },

  // Mostrar spinner
  showSpinner: {
    type: Boolean,
    default: true,
  },

  // Mostrar skeleton loader (alternativa ao spinner)
  showSkeleton: {
    type: Boolean,
    default: false,
  },

  // Cor do spinner
  spinnerColor: {
    type: String,
    default: 'warning', // amarelo do tema
  },

  // Tamanho do spinner: 'sm', 'md', 'lg', 'xl'
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value),
  },

  // Cor da mensagem
  messageColor: {
    type: String,
    default: '#ffffff',
  },

  // Ocupar tela inteira
  fullscreen: {
    type: Boolean,
    default: false,
  },

  // Tipo de skeleton
  skeletonType: {
    type: String,
    default: 'rect',
    validator: (value) => ['rect', 'circle', 'text'].includes(value),
  },

  // Número de skeleton items
  skeletonCount: {
    type: Number,
    default: 3,
  },

  // Altura do skeleton
  skeletonHeight: {
    type: String,
    default: '100px',
  },

  // Largura do skeleton
  skeletonWidth: {
    type: String,
    default: '100%',
  },

  // Espessura do spinner (1-10)
  spinnerThickness: {
    type: Number,
    default: 5,
  },
})

// Computed
const sizeClass = computed(() => `loading-state--${props.size}`)

const spinnerSize = computed(() => {
  const sizes = {
    sm: '40px',
    md: '60px',
    lg: '80px',
    xl: '100px',
  }
  return sizes[props.size] || sizes.md
})
</script>

<style scoped>
/* ==================== BASE ==================== */
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  min-height: 200px;
}

.loading-state--fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  min-height: 100vh;
  background: rgba(42, 52, 71, 0.95);
  z-index: 9999;
}

/* ==================== CONTEÚDO ==================== */
.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-align: center;
}

.loading-message {
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.3px;
  max-width: 400px;
  line-height: 1.5;
}

/* ==================== SKELETON ==================== */
.skeleton-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 600px;
}

.skeleton-item {
  border-radius: 12px;
}

/* ==================== TAMANHOS ==================== */
.loading-state--sm {
  padding: 20px;
  min-height: 100px;
}

.loading-state--sm .loading-message {
  font-size: 0.9rem;
}

.loading-state--md {
  padding: 40px 20px;
  min-height: 200px;
}

.loading-state--lg {
  padding: 60px 20px;
  min-height: 300px;
}

.loading-state--lg .loading-message {
  font-size: 1.1rem;
}

.loading-state--xl {
  padding: 80px 20px;
  min-height: 400px;
}

.loading-state--xl .loading-message {
  font-size: 1.2rem;
}

/* ==================== RESPONSIVIDADE ==================== */
@media (max-width: 768px) {
  .loading-state {
    padding: 30px 16px;
    min-height: 150px;
  }

  .loading-message {
    font-size: 0.95rem;
  }

  .loading-state--sm {
    padding: 16px;
    min-height: 80px;
  }

  .loading-state--lg {
    padding: 40px 16px;
  }

  .loading-state--xl {
    padding: 60px 16px;
  }
}
</style>
