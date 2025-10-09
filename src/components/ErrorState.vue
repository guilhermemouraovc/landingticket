<template>
  <div class="error-state" :class="[sizeClass, { 'error-state--fullscreen': fullscreen }]">
    <div class="error-content">
      <!-- Ícone de erro -->
      <div class="error-icon" :style="{ color: iconColor }">
        <q-icon :name="icon" :size="iconSize" />
      </div>

      <!-- Título do erro -->
      <div v-if="title" class="error-title">
        {{ title }}
      </div>

      <!-- Mensagem de erro -->
      <div class="error-message">
        {{ message || defaultMessage }}
      </div>

      <!-- Mensagem de ajuda/dica -->
      <div v-if="hint" class="error-hint">
        {{ hint }}
      </div>

      <!-- Slot customizável -->
      <slot></slot>

      <!-- Ações -->
      <div class="error-actions">
        <!-- Botão de retry -->
        <q-btn
          v-if="showRetry"
          :color="retryButtonColor"
          :text-color="retryButtonTextColor"
          :label="retryLabel"
          :icon="retryIcon"
          unelevated
          no-caps
          :loading="retrying"
          @click="handleRetry"
          class="error-action-btn"
        />

        <!-- Botão de voltar -->
        <q-btn
          v-if="showBack"
          :color="backButtonColor"
          :text-color="backButtonTextColor"
          :label="backLabel"
          :icon="backIcon"
          outline
          no-caps
          @click="handleBack"
          class="error-action-btn"
        />

        <!-- Slot para ações customizadas -->
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  // Mensagem de erro principal
  message: {
    type: String,
    default: '',
  },

  // Título do erro
  title: {
    type: String,
    default: 'Ops! Algo deu errado',
  },

  // Dica/ajuda adicional
  hint: {
    type: String,
    default: '',
  },

  // Ícone do erro
  icon: {
    type: String,
    default: 'error_outline',
  },

  // Cor do ícone
  iconColor: {
    type: String,
    default: '#f87171', // vermelho suave
  },

  // Tamanho: 'sm', 'md', 'lg', 'xl'
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value),
  },

  // Ocupar tela inteira
  fullscreen: {
    type: Boolean,
    default: false,
  },

  // Mostrar botão de retry
  showRetry: {
    type: Boolean,
    default: true,
  },

  // Label do botão retry
  retryLabel: {
    type: String,
    default: 'Tentar novamente',
  },

  // Ícone do botão retry
  retryIcon: {
    type: String,
    default: 'refresh',
  },

  // Cor do botão retry
  retryButtonColor: {
    type: String,
    default: 'warning',
  },

  // Cor do texto do botão retry
  retryButtonTextColor: {
    type: String,
    default: 'black',
  },

  // Mostrar botão de voltar
  showBack: {
    type: Boolean,
    default: false,
  },

  // Label do botão voltar
  backLabel: {
    type: String,
    default: 'Voltar',
  },

  // Ícone do botão voltar
  backIcon: {
    type: String,
    default: 'arrow_back',
  },

  // Cor do botão voltar
  backButtonColor: {
    type: String,
    default: 'white',
  },

  // Cor do texto do botão voltar
  backButtonTextColor: {
    type: String,
    default: 'white',
  },

  // Rota para voltar (se não definido, usa router.back())
  backRoute: {
    type: [String, Object],
    default: null,
  },
})

// Emits
const emit = defineEmits(['retry', 'back'])

// State
const retrying = ref(false)

// Computed
const sizeClass = computed(() => `error-state--${props.size}`)

const iconSize = computed(() => {
  const sizes = {
    sm: '48px',
    md: '64px',
    lg: '80px',
    xl: '100px',
  }
  return sizes[props.size] || sizes.md
})

const defaultMessage = computed(() => {
  return 'Não foi possível carregar os dados. Verifique sua conexão e tente novamente.'
})

// Methods
async function handleRetry() {
  retrying.value = true
  try {
    await emit('retry')
  } finally {
    // Adiciona delay mínimo para feedback visual
    setTimeout(() => {
      retrying.value = false
    }, 500)
  }
}

function handleBack() {
  emit('back')

  if (props.backRoute) {
    router.push(props.backRoute)
  } else if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
/* ==================== BASE ==================== */
.error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  min-height: 300px;
}

.error-state--fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  min-height: 100vh;
  background: rgba(42, 52, 71, 0.98);
  z-index: 9999;
}

/* ==================== CONTEÚDO ==================== */
.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-align: center;
  max-width: 500px;
  background: rgba(255, 255, 255, 0.04);
  padding: 40px 32px;
  border-radius: 20px;
}

.error-state--fullscreen .error-content {
  background: rgba(255, 255, 255, 0.06);
  padding: 48px 40px;
}

/* ==================== ÍCONE ==================== */
.error-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  height: fit-content;
  padding: 16px;
  background: rgba(248, 113, 113, 0.1);
  border-radius: 50%;
  animation: pulse-error 2s ease-in-out infinite;
}

@keyframes pulse-error {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

/* ==================== TEXTOS ==================== */
.error-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-top: 8px;
}

.error-message {
  font-size: 1rem;
  font-weight: 400;
  color: #e5e7eb;
  line-height: 1.6;
  max-width: 400px;
}

.error-hint {
  font-size: 0.9rem;
  color: #9ca3af;
  line-height: 1.5;
  font-style: italic;
}

/* ==================== AÇÕES ==================== */
.error-actions {
  display: flex;
  gap: 12px;
  margin-top: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.error-action-btn {
  min-width: 140px;
  height: 44px;
  border-radius: 8px;
  font-weight: 600;
}

/* ==================== TAMANHOS ==================== */
.error-state--sm {
  padding: 24px 16px;
  min-height: 200px;
}

.error-state--sm .error-content {
  padding: 24px 20px;
  gap: 16px;
}

.error-state--sm .error-title {
  font-size: 1.25rem;
}

.error-state--sm .error-message {
  font-size: 0.9rem;
}

.error-state--md {
  padding: 40px 20px;
  min-height: 300px;
}

.error-state--lg {
  padding: 60px 20px;
  min-height: 400px;
}

.error-state--lg .error-content {
  padding: 48px 40px;
  gap: 24px;
}

.error-state--lg .error-title {
  font-size: 1.75rem;
}

.error-state--lg .error-message {
  font-size: 1.1rem;
}

.error-state--xl {
  padding: 80px 20px;
  min-height: 500px;
}

.error-state--xl .error-content {
  padding: 56px 48px;
  gap: 28px;
}

.error-state--xl .error-title {
  font-size: 2rem;
}

.error-state--xl .error-message {
  font-size: 1.2rem;
}

/* ==================== RESPONSIVIDADE ==================== */
@media (max-width: 768px) {
  .error-state {
    padding: 24px 16px;
    min-height: 250px;
  }

  .error-content {
    padding: 32px 24px;
    gap: 16px;
    max-width: 100%;
  }

  .error-title {
    font-size: 1.25rem;
  }

  .error-message {
    font-size: 0.95rem;
  }

  .error-actions {
    flex-direction: column;
    width: 100%;
  }

  .error-action-btn {
    width: 100%;
  }
}
</style>
