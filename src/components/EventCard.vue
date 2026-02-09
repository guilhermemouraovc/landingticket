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
      :role="clickable ? 'button' : undefined"
      :tabindex="clickable ? 0 : -1"
      :aria-label="clickable ? `Evento: ${event.title || 'Sem nome'}. ${event.date || ''}. ${event.location || ''}` : undefined"
      :aria-disabled="clickable ? undefined : 'true'"
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
.event-card-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
}

.event-card__badge {
  position: absolute;
  top: -33px;
  left: 18px;
  background-image: url('/Vector.svg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  color: #ffffff;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 13px;
  padding: 8px 16px;
  min-width: 160px;
  text-align: center;
  z-index: 1;
  text-transform: none;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.event-card--clickable:hover .event-card__badge,
.event-card--clickable:focus-within .event-card__badge {
  transform: translateY(-4px);
}

.event-card {
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  background: transparent;
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

.event-card:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px #35c7ee;
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

.event-card__image {
  width: 100%;
  object-fit: cover;
  border-radius: 24px 24px 0 0;
  display: block;
  flex-shrink: 0;

  :deep(.q-img__container) {
    border-radius: 24px 24px 0 0;
  }

  :deep(.q-img__image) {
    border-radius: 24px 24px 0 0;
  }

  :deep(img) {
    border-radius: 24px 24px 0 0;
    display: block;
  }
}

.event-card__body {
  flex: 1;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: #1f2937;
  background: #ffffff;
  border-radius: 0 0 24px 24px;
}

.event-card__title {
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.2;
  color: #1f2937;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.event-card__meta {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 35px;
  color: #000000;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 400;
}

.meta-layout--column,
.meta-layout--row {
  flex-direction: row;
  flex-wrap: wrap;
}

.meta-layout--stacked {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .meta-item {
    width: 100%;
  }
}

.event-card__meta--no-price {
  font-size: 16px;
  margin-top: 8px;
  justify-content: center;

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
  color: #d907f2;
  font-size: 16px;
}

.meta-highlight {
  color: #000000;
  font-weight: 400;
}

.event-card__price-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

.price-full {
  font-family: 'Poppins', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #000000;
  line-height: 1.2;
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
  font-size: 10px;
  color: #008ec1;
  font-weight: 400;
}

.installment-value {
  line-height: 1.2;
}

@media (max-width: 768px) {
  .event-card-wrapper:has(.event-card--carousel) {
    flex: 0 0 280px;
    width: 280px;
  }

  .event-card__body {
    padding: 16px 18px;
  }

  .event-card__meta {
    font-size: 12px;
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
    font-size: 18px;
    line-height: 1.2;
  }

  .event-card__meta {
    font-size: 12px;
    gap: 24px;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }

  .meta-item {
    gap: 6px;
    flex-shrink: 0;
  }

  .meta-icon {
    font-size: 16px !important;
    color: #d907f2 !important;
  }

  .event-card__image {
    height: 180px !important;
  }

  .event-card__meta .meta-item span {
    color: #000000;
    font-weight: 400;
  }

  .event-card__meta--no-price {
    font-size: 14px;
    margin-top: 6px;

    .meta-icon {
      font-size: 16px !important;
    }
  }

  .event-card__body--no-price {
    padding-top: 16px;
  }
}
</style>
