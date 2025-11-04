<template>
  <component
    :is="iconComponent"
    :size="size"
    :weight="weight"
    :color="color"
    v-if="iconComponent"
  />
</template>

<script setup>
import { computed } from 'vue'

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

// Importação estática apenas dos ícones usados (reduz drasticamente o bundle)
import {
  PhConfetti,
  PhCheers,
  PhBeerStein,
  PhHamburger,
  PhCampfire,
  PhStar,
  PhCow,
  PhSpeakerHifi,
  PhMicrophoneStage,
  PhGuitar,
  PhDisc,
  PhMusicNotes,
  PhPianoKeys,
  PhCowboyHat,
} from '@phosphor-icons/vue'

// Mapeamento de ícones Phosphor usados no projeto
const iconMap = {
  confetti: PhConfetti,
  cheers: PhCheers,
  'beer-stein': PhBeerStein,
  hamburger: PhHamburger,
  campfire: PhCampfire,
  star: PhStar,
  cow: PhCow,
  'speaker-hifi': PhSpeakerHifi,
  'microphone-stage': PhMicrophoneStage,
  guitar: PhGuitar,
  disc: PhDisc,
  'music-notes': PhMusicNotes,
  'piano-keys': PhPianoKeys,
  'cowboy-hat': PhCowboyHat,
}

const iconComponent = computed(() => {
  const Icon = iconMap[props.name]
  if (!Icon) {
    if (import.meta.env.DEV) {
      console.warn(`Ícone Phosphor não encontrado: ${props.name}`)
    }
    return null
  }

  return Icon
})
</script>
