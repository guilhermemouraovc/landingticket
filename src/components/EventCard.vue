<template>
  <q-card
    class="event-card"
    :class="[`event-card--${variant}`, { 'event-card--clickable': clickable }]"
    flat
    :clickable="clickable"
    v-ripple="clickable"
    @click="handleClick"
    role="button"
    :tabindex="clickable ? 0 : -1"
    :aria-label="`Evento: ${event.title || 'Sem nome'}. ${event.date || ''}. ${event.location || ''}`"
  >
    <!-- Imagem do evento -->
    <q-img
      :src="event.image || defaultImage"
      :alt="`Imagem do evento ${event.title || 'Sem nome'}`"
      class="event-card__image"
      :height="imageHeight"
      ratio="16/9"
      spinner-color="white"
      :loading="lazyLoad ? 'lazy' : 'eager'"
    >
      <!-- Slot para badges/overlays na imagem -->
      <slot name="image-overlay"></slot>
    </q-img>

    <!-- Corpo do card -->
    <q-card-section class="event-card__body">
      <!-- Título -->
      <div class="event-card__title text-weight-bold">
        {{ event.title || 'Evento sem nome' }}
      </div>

      <!-- Descrição (opcional) -->
      <div v-if="showDescription && event.description" class="event-card__description">
        {{ truncatedDescription }}
      </div>

      <!-- Meta informações (data e localização) -->
      <div class="event-card__meta" :class="metaLayoutClass">
        <!-- Data -->
        <div class="meta-item">
          <q-icon :name="dateIcon" :size="iconSize" class="meta-icon" aria-hidden="true" />
          <span :class="{ 'meta-highlight': highlightDate }">{{ event.date }}</span>
        </div>

        <!-- Localização (city - state) -->
        <div class="meta-item">
          <q-icon :name="locationIcon" :size="iconSize" class="meta-icon" aria-hidden="true" />
          <span>{{ event.cityState || event.location || 'Local a definir' }}</span>
        </div>
      </div>

      <!-- Seção de Preços -->
      <div v-if="event.hasPrice && showPrice" class="event-card__price-section">
        <!-- Preço À Vista -->
        <div v-if="event.fullPrice" class="price-full">
          {{ event.formattedFullPrice }}
        </div>

        <!-- Preço Parcelado (se existir) -->
        <div v-if="event.installments && event.installmentValue" class="price-installment">
          <span class="installment-label">{{ event.installments }}x de</span>
          <span class="installment-value">{{ event.formattedInstallmentValue }}</span>
          <span class="installment-info">sem juros</span>
        </div>
      </div>

      <!-- Slot para conteúdo adicional -->
      <slot name="footer"></slot>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { DEFAULT_IMAGES } from 'src/constants/config'

// Props
const props = defineProps({
  // Dados do evento (obrigatório)
  event: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && typeof value === 'object'
    },
  },

  // Altura da imagem
  imageHeight: {
    type: String,
    default: '220px',
  },

  // Variante do card: 'carousel' (horizontal scroll) ou 'grid' (grade)
  variant: {
    type: String,
    default: 'carousel',
    validator: (value) => ['carousel', 'grid'].includes(value),
  },

  // Imagem padrão caso não tenha
  defaultImage: {
    type: String,
    default: DEFAULT_IMAGES.eventPlaceholder,
  },

  // Se o card é clicável
  clickable: {
    type: Boolean,
    default: true,
  },

  // Destacar a data (cor rosa)
  highlightDate: {
    type: Boolean,
    default: true,
  },

  // Mostrar descrição
  showDescription: {
    type: Boolean,
    default: false,
  },

  // Limite de caracteres da descrição
  descriptionLimit: {
    type: Number,
    default: 100,
  },

  // Lazy loading de imagens
  lazyLoad: {
    type: Boolean,
    default: true,
  },

  // Ícone customizado para data
  dateIcon: {
    type: String,
    default: 'event',
  },

  // Ícone customizado para localização
  locationIcon: {
    type: String,
    default: 'place',
  },

  // Tamanho dos ícones
  iconSize: {
    type: String,
    default: '18px',
  },

  // Mostrar preços
  showPrice: {
    type: Boolean,
    default: true,
  },
})

// Emits
const emit = defineEmits(['click'])

// Computed
const metaLayoutClass = computed(() => {
  return props.variant === 'grid' ? 'meta-layout--row' : 'meta-layout--column'
})

const truncatedDescription = computed(() => {
  if (!props.event.description) return ''
  const desc = props.event.description
  if (desc.length <= props.descriptionLimit) return desc
  return desc.substring(0, props.descriptionLimit) + '...'
})

// Methods
function handleClick() {
  if (props.clickable) {
    emit('click', props.event)
  }
}
</script>

<style scoped lang="scss">
/* ==================== BASE ==================== */
.event-card {
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 16px -12px rgba(15, 23, 42, 0.28);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  overflow: hidden;
  border: none;
  outline: none;
}

.event-card--clickable {
  cursor: pointer;
}

.event-card--clickable:hover,
.event-card--clickable:focus-within {
  transform: translateY(-4px);
  box-shadow: 0 24px 40px -12px rgba(15, 23, 42, 0.36);
}

/* ==================== ACESSIBILIDADE - FOCUS STATES ==================== */
.event-card:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px #35c7ee;
}

/* ==================== VARIANTES ==================== */

/* Carousel variant - largura fixa */
.event-card--carousel {
  flex: 0 0 320px;
  width: 320px;
}

/* Grid variant - largura flexível */
.event-card--grid {
  width: 100%;
}

/* ==================== ESTRUTURA ==================== */

.event-card__image {
  width: 100%;
  object-fit: cover;
}

.event-card__body {
  flex: 1;
  padding: 15px 15px 15px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: #1f2937;
}

.event-card__title {
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 600; /* Semibold */
  line-height: 1.2;
  color: #1f2937;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.event-card__description {
  font-size: 0.9rem;
  line-height: 1.5;
  color: #6b7280;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ==================== META ==================== */

.event-card__meta {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 35px;
  color: #000000;
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  font-weight: 400;
}

.meta-layout--column {
  flex-direction: row; /* Sempre lado a lado */
}

.meta-layout--row {
  flex-direction: row;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta-icon {
  color: #d907f2; /* Roxo do protótipo */
  font-size: 16px;
}

.meta-highlight {
  color: #000000; /* Texto preto */
  font-weight: 400;
}

/* ==================== RESPONSIVIDADE ==================== */

/* ==================== PREÇOS ==================== */

.event-card__price-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.price-full {
  font-family: 'Poppins', sans-serif;
  font-size: 24px; /* tamanho 100 no design */
  font-weight: 600; /* Semibold */
  color: #000000;
  line-height: 1.2;
}

.price-installment {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
}

.installment-label {
  font-family: 'Poppins', sans-serif;
  font-size: 10px; /* tamanho 41 no design */
  color: #008ec1;
  font-weight: 400;
}

.installment-value {
  font-family: 'Poppins', sans-serif;
  font-size: 10px; /* tamanho 41 no design */
  font-weight: 400;
  color: #008ec1;
  line-height: 1.2;
}

.installment-info {
  font-family: 'Poppins', sans-serif;
  font-size: 10px; /* tamanho 41 no design */
  color: #008ec1;
  font-weight: 400;
}

/* ==================== RESPONSIVIDADE ==================== */

/* Tablet (até 768px) */
@media (max-width: 768px) {
  .event-card--carousel {
    flex: 0 0 280px;
    width: 280px;
  }

  .event-card__body {
    padding: 16px 18px 16px;
  }

  .event-card__title {
    font-size: 18px;
  }

  .event-card__meta {
    font-size: 12px;
  }

  .price-full {
    font-size: 24px;
  }

  .installment-label,
  .installment-value,
  .installment-info {
    font-size: 10px;
  }
}

/* Mobile (até 599px - breakpoint sm do Quasar) */
@media (max-width: 599px) {
  .event-card--carousel {
    flex: 0 0 280px;
    width: 280px;
  }

  .event-card__body {
    padding: 12px 14px 12px;
    gap: 8px;
    height: 167px; /* altura fixa da área branca com textos no mobile */
    overflow: hidden;
  }

  .event-card__title {
    font-size: 18px; /* título conforme protótipo */
    line-height: 1.2;
  }

  .event-card__description {
    font-size: 0.75rem;
  }

  .event-card__meta {
    font-size: 12px;
    gap: 24px;
  }

  .meta-item {
    gap: 6px;
  }

  .meta-icon {
    font-size: 16px !important;
    color: #d907f2 !important;
  }

  /* Controla a altura visual da imagem no mobile */
  .event-card__image {
    height: 180px !important;
  }

  /* Texto sempre em preto */
  .event-card__meta .meta-item span {
    color: #000000;
    font-weight: 400;
  }

  .price-full {
    font-size: 24px;
  }

  .installment-label,
  .installment-value,
  .installment-info {
    font-size: 10px;
  }

  /* No mobile, coloca data e localização lado a lado como no protótipo */
  .event-card__meta {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }

  .meta-item {
    flex-shrink: 0;
  }
}
</style>
