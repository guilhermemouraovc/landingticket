<template>
  <div class="back-button-container" @click="handleClick" role="button" tabindex="0" :aria-label="ariaLabel">
    <div class="back-icon">
      <q-icon name="arrow_back" size="24px" class="back-arrow-icon" />
    </div>
    <span class="back-text">{{ label }}</span>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  label: {
    type: String,
    default: 'Voltar',
  },
  to: {
    type: [String, Object],
    default: '/',
  },
  useHistory: {
    type: Boolean,
    default: false,
  },
})

const router = useRouter()

const ariaLabel = `Voltar para ${typeof props.to === 'string' ? props.to : 'página anterior'}`

function handleClick() {
  if (props.useHistory && typeof window !== 'undefined' && window.history.length > 1) {
    router.back()
  } else {
    router.push(props.to)
  }
}
</script>

<style scoped>
.back-button-container {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.back-button-container:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.back-icon {
  width: 56px;
  height: 56px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.back-text {
  color: white;
  font-weight: 600;
  font-size: 16px;
  font-family: 'Poppins', system-ui, -apple-system, sans-serif;
}

.back-button-container:focus-visible {
  outline: 2px solid #35c7ee;
  outline-offset: 4px;
  border-radius: 8px;
}

.back-arrow-icon {
  color: #35c7ee !important;
}

.back-arrow-icon .q-icon {
  color: #35c7ee !important;
}

.back-icon .q-icon {
  color: #35c7ee !important;
}

.back-icon svg {
  width: 24px;
  height: 24px;
}

/* Responsividade mobile */
@media (max-width: 599px) {
  .back-button-container {
    gap: 8px;
    padding: 4px;
  }

  .back-icon {
    width: 40px;
    height: 40px;
  }

  .back-text {
    font-size: 14px;
  }
}
</style>

