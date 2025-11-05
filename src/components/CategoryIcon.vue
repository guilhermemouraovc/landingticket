<template>
  <PhosphorIcon
    v-if="typeof icon === 'object' && icon.type === 'phosphor'"
    :name="icon.name"
    :size="size"
    weight="fill"
    :color="color"
    :class="iconClass"
  />
  <q-icon
    v-else-if="typeof icon === 'string'"
    :name="icon"
    :class="iconClass"
  />
</template>

<script setup>
import PhosphorIcon from './PhosphorIcon.vue'

defineProps({
  icon: {
    type: [Object, String],
    required: true,
  },
  size: {
    type: Number,
    default: 20,
  },
  color: {
    type: String,
    default: 'white',
  },
  iconClass: {
    type: String,
    default: '',
  },
})
</script>

