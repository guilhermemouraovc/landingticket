<template>
  <div class="event-card-wrapper">
    <div v-if="event.showLastTickets" class="event-card__badge">Últimos ingressos!</div>

    <q-card
      class="event-card"
      :class="[`event-card--${variant}`, { 'event-card--clickable': clickable }]"
      flat
      :clickable="clickable"
      v-ripple="clickable"
      @click="handleClick"
      @touchstart.passive="handleTouchStart"
      @touchmove.passive="handleTouchMove"
      role="button"
      :tabindex="clickable ? 0 : -1"
      :aria-label="`Evento: ${event.title || 'Sem nome'}. ${event.date || ''}. ${event.location || ''}`"
    >
      <q-img
        :src="event.image || defaultImage"
        :alt="`Imagem do evento ${event.title || 'Sem nome'}`"
        class="event-card__image"
        :height="imageHeight"
        ratio="16/9"
        spinner-color="white"
        loading="lazy"
      >
        <slot name="image-overlay"></slot>
      </q-img>

      <q-card-section
        class="event-card__body"
        :class="{ 'event-card__body--no-price': !event.hasPrice && showPrice }"
      >
        <div class="event-card__title text-weight-bold">
          {{ event.title || 'Evento sem nome' }}
        </div>

        <div
          class="event-card__meta"
          :class="[metaLayoutClass, { 'event-card__meta--no-price': !event.hasPrice && showPrice }]"
        >
          <div class="meta-item">
            <q-icon :name="dateIcon" :size="iconSize" class="meta-icon" aria-hidden="true" />
            <span :class="{ 'meta-highlight': highlightDate }">{{ event.date }}</span>
          </div>

          <div class="meta-item">
            <q-icon :name="locationIcon" :size="iconSize" class="meta-icon" aria-hidden="true" />
            <span>{{ event.cityState || event.location || 'Local a definir' }}</span>
          </div>
        </div>

        <div v-if="event.hasPrice && showPrice" class="event-card__price-section">
          <div v-if="event.fullPrice" class="price-full">
            {{ event.formattedFullPrice }}
          </div>

          <div
            v-if="event.shouldShowInstallments && event.installments && event.installmentValue"
            class="price-installment"
          >
            <span class="installment-label">{{ event.installments }}x de</span>
            <span class="installment-value">{{ event.formattedInstallmentValue }}</span>
            <span class="installment-info">sem juros</span>
          </div>

          <div
            v-else-if="event.hasPrice && !event.shouldShowInstallments"
            class="price-installment"
          >
            <span class="installment-info">No pix ou no cartão</span>
          </div>
        </div>

        <slot name="footer"></slot>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { DEFAULT_IMAGES } from 'src/constants/config'

const props = defineProps({
  event: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && typeof value === 'object'
    },
  },
  imageHeight: {
    type: String,
    default: '220px',
  },
  variant: {
    type: String,
    default: 'carousel',
    validator: (value) => ['carousel', 'grid'].includes(value),
  },
  defaultImage: {
    type: String,
    default: DEFAULT_IMAGES.eventPlaceholder,
  },
  clickable: {
    type: Boolean,
    default: true,
  },
  highlightDate: {
    type: Boolean,
    default: true,
  },
  dateIcon: {
    type: String,
    default: 'event',
  },
  locationIcon: {
    type: String,
    default: 'place',
  },
  iconSize: {
    type: String,
    default: '18px',
  },
  showPrice: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['click'])

const touchStartPos = ref({ x: 0, y: 0 })
const isDragging = ref(false)

const metaLayoutClass = computed(() => {
  if (!props.event.hasPrice && props.showPrice && props.variant !== 'grid') {
    return 'meta-layout--stacked'
  }
  return props.variant === 'grid' ? 'meta-layout--row' : 'meta-layout--column'
})

function handleTouchStart(e) {
  isDragging.value = false
  if (e.touches && e.touches.length > 0) {
    touchStartPos.value = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    }
  }
}

function handleTouchMove(e) {
  if (isDragging.value) return
  if (!e.touches || e.touches.length === 0) return

  const deltaX = Math.abs(e.touches[0].clientX - touchStartPos.value.x)
  const deltaY = Math.abs(e.touches[0].clientY - touchStartPos.value.y)

  if (deltaX > 10 || deltaY > 10) {
    isDragging.value = true
  }
}

function handleClick(e) {
  if (isDragging.value) {
    e?.preventDefault()
    e?.stopPropagation()
    return
  }
  if (props.clickable) {
    emit('click', props.event)
  }
}
</script>

<style scoped lang="scss">
/* ==================== BRUTAL EVENT CARD ==================== */
.event-card-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
}

/* Badge - BRUTAL */
.event-card__badge {
  position: absolute;
  top: -12px;
  left: 12px;
  background: #FFE500;
  color: #1a1a1a;
  font-family: 'Poppins', sans-serif;
  font-weight: 800;
  font-size: 11px;
  padding: 6px 12px;
  min-width: auto;
  text-align: center;
  z-index: 2;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  border: 3px solid #1a1a1a;
  border-radius: 0;
  box-shadow: 3px 3px 0px #1a1a1a;
}

.event-card--clickable:hover .event-card__badge,
.event-card--clickable:focus-within .event-card__badge {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0px #1a1a1a;
}

/* Card principal - BRUTAL */
.event-card {
  display: flex;
  flex-direction: column;
  border-radius: 0;
  background: transparent;
  border: 3px solid #1a1a1a;
  box-shadow: 6px 6px 0px #1a1a1a;
  transition: all 0.15s ease;
  overflow: hidden;
  outline: none;
}

.event-card--clickable {
  cursor: pointer;
}

.event-card--clickable:hover {
  transform: translate(-4px, -4px);
  box-shadow: 10px 10px 0px #1a1a1a;
}

.event-card--clickable:active {
  transform: translate(2px, 2px);
  box-shadow: 4px 4px 0px #1a1a1a;
}

.event-card:focus-visible {
  outline: 3px solid #FFE500;
  outline-offset: 2px;
}

.event-card-wrapper:has(.event-card--carousel) {
  flex: 0 0 320px;
  width: 320px;
}

.event-card--carousel {
  width: 100%;
}

.event-card-wrapper:has(.event-card--grid) {
  width: 100%;
}

.event-card--grid {
  width: 100%;
}

/* Imagem - BRUTAL */
.event-card__image {
  width: 100%;
  object-fit: cover;
  border-radius: 0;
  display: block;
  flex-shrink: 0;
  border-bottom: 3px solid #1a1a1a;

  :deep(.q-img__container) {
    border-radius: 0;
  }

  :deep(.q-img__image) {
    border-radius: 0;
  }

  :deep(img) {
    border-radius: 0;
    display: block;
  }
}

/* Body - BRUTAL */
.event-card__body {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: #1a1a1a;
  background: #fafafa;
  border-radius: 0;
}

/* Título - BRUTAL */
.event-card__title {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 800;
  line-height: 1.2;
  color: #1a1a1a;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: -0.3px;
}

/* Meta info - BRUTAL */
.event-card__meta {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
  color: #1a1a1a;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  font-weight: 600;
}

.meta-layout--column,
.meta-layout--row {
  flex-direction: row;
  flex-wrap: wrap;
}

.meta-layout--stacked {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .meta-item {
    width: 100%;
  }
}

.event-card__meta--no-price {
  font-size: 14px;
  margin-top: 8px;
  justify-content: flex-start;

  .meta-icon {
    font-size: 18px;
  }
}

.event-card__body--no-price {
  padding-top: 20px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta-icon {
  color: #d446e4;
  font-size: 16px;
}

.meta-highlight {
  color: #1a1a1a;
  font-weight: 700;
}

/* Preços - BRUTAL */
.event-card__price-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-shrink: 0;
  padding-top: 8px;
  border-top: 2px solid #1a1a1a;
  margin-top: auto;
}

.price-full {
  font-family: 'Poppins', sans-serif;
  font-size: 22px;
  font-weight: 800;
  color: #1a1a1a;
  line-height: 1.1;
}

.price-installment {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
}

.installment-label,
.installment-value,
.installment-info {
  font-family: 'Poppins', sans-serif;
  font-size: 11px;
  color: #008ec1;
  font-weight: 700;
}

.installment-value {
  line-height: 1.2;
}

/* ==================== RESPONSIVE - BRUTAL ==================== */
@media (max-width: 768px) {
  .event-card-wrapper:has(.event-card--carousel) {
    flex: 0 0 280px;
    width: 280px;
  }

  .event-card__body {
    padding: 14px 16px;
  }

  .event-card__meta {
    font-size: 12px;
  }

  .event-card {
    box-shadow: 5px 5px 0px #1a1a1a;
  }

  .event-card--clickable:hover {
    transform: translate(-3px, -3px);
    box-shadow: 8px 8px 0px #1a1a1a;
  }
}

@media (max-width: 599px) {
  .event-card-wrapper:has(.event-card--carousel) {
    flex: 0 0 280px;
    width: 280px;
  }

  .event-card__body {
    padding: 12px 14px;
    gap: 8px;
    height: 167px;
    overflow: hidden;
  }

  .event-card__title {
    font-size: 15px;
    line-height: 1.2;
  }

  .event-card__meta {
    font-size: 11px;
    gap: 16px;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }

  .meta-item {
    gap: 5px;
    flex-shrink: 0;
  }

  .meta-icon {
    font-size: 14px !important;
    color: #d446e4 !important;
  }

  .event-card__image {
    height: 180px !important;
  }

  .event-card__meta .meta-item span {
    color: #1a1a1a;
    font-weight: 600;
  }

  .event-card__meta--no-price {
    font-size: 13px;
    margin-top: 6px;

    .meta-icon {
      font-size: 15px !important;
    }
  }

  .event-card__body--no-price {
    padding-top: 14px;
  }

  .event-card {
    box-shadow: 4px 4px 0px #1a1a1a;
  }

  .event-card--clickable:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px #1a1a1a;
  }

  .event-card__badge {
    top: -10px;
    left: 10px;
    font-size: 10px;
    padding: 4px 8px;
    box-shadow: 2px 2px 0px #1a1a1a;
  }
}
</style>
