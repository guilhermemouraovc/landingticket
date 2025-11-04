<template>
  <component :is="iconComponent" :size="size" :weight="weight" :color="color" />
</template>

<script setup>
import { computed } from 'vue'
import * as PhosphorIcons from '@phosphor-icons/vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: [String, Number],
    default: 24,
  },
  weight: {
    type: String,
    default: 'regular',
    validator: (value) => ['thin', 'light', 'regular', 'bold', 'fill', 'duotone'].includes(value),
  },
  color: {
    type: String,
    default: 'currentColor',
  },
})

const iconComponent = computed(() => {
  const iconName = `Ph${props.name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')}`

  return PhosphorIcons[iconName] || null
})
</script>
