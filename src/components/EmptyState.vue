<template>
  <div class="empty-state" role="status">
    <q-icon :name="icon" :size="iconSize" color="grey-6" aria-hidden="true" />
    <div class="empty-state-title">{{ title }}</div>
    <div class="empty-state-text">{{ message }}</div>
    <q-btn
      v-if="showButton"
      :color="buttonColor"
      :label="buttonLabel"
      :to="buttonTo"
      no-caps
      unelevated
      :aria-label="buttonAriaLabel"
      class="q-mt-md"
      @click="handleButtonClick"
    />
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: 'search_off',
  },
  iconSize: {
    type: String,
    default: '64px',
  },
  showButton: {
    type: Boolean,
    default: true,
  },
  buttonLabel: {
    type: String,
    default: 'Ver todos os eventos',
  },
  buttonColor: {
    type: String,
    default: 'primary',
  },
  buttonTo: {
    type: [String, Object],
    default: null,
  },
  buttonAriaLabel: {
    type: String,
    default: 'Ver todos os eventos',
  },
})

const emit = defineEmits(['button-click'])

function handleButtonClick() {
  emit('button-click')
}
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.empty-state-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-top: 24px;
  margin-bottom: 8px;
}

.empty-state-text {
  font-size: 1rem;
  color: #9ca3af;
  max-width: 400px;
  line-height: 1.6;
}

/* Responsividade mobile */
@media (max-width: 599px) {
  .empty-state {
    padding: 60px 16px;
  }

  .empty-state-title {
    font-size: 1.25rem;
  }

  .empty-state-text {
    font-size: 0.9rem;
    max-width: 100%;
  }
}
</style>

