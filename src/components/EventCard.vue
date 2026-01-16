<template>
  <div class="event-card-wrapper">
    <!-- Badge "Últimos ingressos!" - ACIMA DO CARD -->
    <div v-if="event.showLastTickets" class="event-card__badge">Últimos ingressos!</div>

    <q-card
      class="event-card"
      :class="[`event-card--${variant}`, { 'event-card--clickable': clickable && !adminMode }]"
      flat
      :clickable="clickable && !adminMode"
      v-ripple="clickable && !adminMode"
      @click="handleClick"
      @touchstart.passive="handleTouchStart"
      @touchmove.passive="handleTouchMove"
      role="button"
      :tabindex="clickable && !adminMode ? 0 : -1"
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
      <slot name="image-overlay">
        <div
          v-if="adminMode"
          class="absolute-top-right q-pa-sm row q-gutter-sm no-wrap"
          style="z-index: 10"
        >
          <q-btn
            round
            dense
            color="white"
            text-color="primary"
            icon="edit"
            @click.stop="$emit('edit', event)"
          >
            <q-tooltip>Editar Completo</q-tooltip>
          </q-btn>
          <q-btn round dense color="negative" icon="delete" @click.stop="$emit('delete', event)">
            <q-tooltip>Deletar</q-tooltip>
          </q-btn>
        </div>
      </slot>
    </q-img>

    <!-- Corpo do card -->
    <q-card-section
      class="event-card__body"
      :class="{ 'event-card__body--no-price': !event.hasPrice && showPrice }"
    >
      <!-- Título -->
      <div class="event-card__title text-weight-bold relative-position cursor-pointer">
        {{ event.title || 'Evento sem nome' }}
        <q-popup-edit
          v-if="adminMode"
          :model-value="event.title"
          @save="(val) => emit('patch', { id: event.id, title: val })"
          v-slot="scope"
          label-set="Salvar"
          label-cancel="Cancelar"
          buttons
        >
          <q-input
            v-model="scope.value"
            dense
            autofocus
            counter
            @keyup.enter="scope.set"
            label="Título"
          />
        </q-popup-edit>
        <q-tooltip v-if="adminMode" anchor="top middle" self="bottom middle"
          >Clique para editar título</q-tooltip
        >
      </div>

      <!-- Descrição (opcional) -->
      <div
        v-if="showDescription && event.description"
        class="event-card__description relative-position cursor-pointer"
      >
        {{ truncatedDescription }}
        <q-popup-edit
          v-if="adminMode"
          :model-value="event.description"
          @save="(val) => emit('patch', { id: event.id, description: val })"
          v-slot="scope"
          label-set="Salvar"
          label-cancel="Cancelar"
          buttons
        >
          <q-input
            v-model="scope.value"
            dense
            autofocus
            type="textarea"
            rows="3"
            label="Descrição"
          />
        </q-popup-edit>
        <q-tooltip v-if="adminMode">Clique para editar descrição</q-tooltip>
      </div>

      <!-- Meta informações (data e localização) -->
      <div
        class="event-card__meta"
        :class="[metaLayoutClass, { 'event-card__meta--no-price': !event.hasPrice && showPrice }]"
      >
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
        <div
          v-if="event.fullPrice"
          class="price-full relative-position cursor-pointer"
          :class="{ 'price-full--no-installments': !event.shouldShowInstallments }"
        >
          {{ event.formattedFullPrice }}
          <q-popup-edit
            v-if="adminMode"
            :model-value="event.fullPrice"
            @save="(val) => emit('patch', { id: event.id, price: Number(val) })"
            v-slot="scope"
            label-set="Salvar"
            label-cancel="Cancelar"
            buttons
          >
            <q-input
              v-model.number="scope.value"
              dense
              autofocus
              type="number"
              step="0.01"
              @keyup.enter="scope.set"
              prefix="R$"
              label="Preço"
            />
          </q-popup-edit>
          <q-tooltip v-if="adminMode">Clique para editar preço</q-tooltip>
        </div>

        <!-- Preço Parcelado (apenas se relevante: preço >= R$100 e mais de 1 parcela) -->
        <div
          v-if="event.shouldShowInstallments && event.installments && event.installmentValue"
          class="price-installment"
        >
          <span class="installment-label">{{ event.installments }}x de</span>
          <span class="installment-value">{{ event.formattedInstallmentValue }}</span>
          <span class="installment-info">sem juros</span>
        </div>

        <!-- Mensagem alternativa quando não há parcelas -->
        <div v-else-if="event.hasPrice && !event.shouldShowInstallments" class="price-installment">
          <span class="installment-info">No pix ou no cartão</span>
        </div>
      </div>
      <!-- Spacer para manter consistência visual quando sem preço -->
      <div v-else-if="showPrice" class="event-card__price-spacer"></div>

      <!-- Slot para conteúdo adicional -->
      <slot name="footer"></slot>
    </q-card-section>
  </q-card>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
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

  // Modo Admin (Habilita edição inline e botões)
  adminMode: {
    type: Boolean,
    default: false,
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
const emit = defineEmits(['click', 'patch', 'edit', 'delete'])

// State for touch handling
const touchStartPos = ref({ x: 0, y: 0 })
const isDragging = ref(false)

// Computed
const metaLayoutClass = computed(() => {
  if (!props.event.hasPrice && props.showPrice && props.variant !== 'grid') {
    return 'meta-layout--stacked'
  }
  return props.variant === 'grid' ? 'meta-layout--row' : 'meta-layout--column'
})

const truncatedDescription = computed(() => {
  if (!props.event.description) return ''
  const desc = props.event.description
  if (desc.length <= props.descriptionLimit) return desc
  return desc.substring(0, props.descriptionLimit) + '...'
})

// Methods
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
  // No modo admin, o clique no card não navega, pois o usuário pode estar tentando clicar em um controle de edição
  // Mas se clicar fora dos controles, talvez queira navegar?
  // Por segurança, no adminMode, desabilitamos o click geral do card
  if (props.clickable && !props.adminMode) {
    emit('click', props.event)
  }
}
</script>

<style scoped lang="scss">
/* ==================== WRAPPER ==================== */
.event-card-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
}

/* ==================== BADGE "ÚLTIMOS INGRESSOS" ==================== */
.event-card__badge {
  position: absolute;
  top: -36px;
  left: 12px;
  background: #45c0e7;
  color: #ffffff;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 13px;
  padding: 6px 14px;
  border-radius: 8px;
  z-index: 10;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  text-transform: none;
  white-space: nowrap;
}

/* ==================== BASE ==================== */
.event-card {
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  background: transparent; /* Remove fundo branco */
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

/* Hover apenas em dispositivos não-touch (desktop) */
@media (hover: hover) and (pointer: fine) {
  .event-card--clickable:hover,
  .event-card--clickable:focus-within {
    transform: translateY(-4px);
    box-shadow: 0 24px 40px -12px rgba(15, 23, 42, 0.36);
  }
}

/* ==================== ACESSIBILIDADE - FOCUS STATES ==================== */
.event-card:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px #35c7ee;
}

/* ==================== VARIANTES ==================== */

/* Carousel variant - largura fixa */
.event-card-wrapper:has(.event-card--carousel) {
  flex: 0 0 320px;
  width: 320px;
}

.event-card--carousel {
  width: 100%;
}

/* Grid variant - largura flexível */
.event-card-wrapper:has(.event-card--grid) {
  width: 100%;
}

.event-card--grid {
  width: 100%;
}

/* ==================== ESTRUTURA ==================== */

.event-card__image {
  width: 100%;
  object-fit: cover;
  border-radius: 24px 24px 0 0;
  display: block;
  flex-shrink: 0;

  /* Força o q-img a respeitar o border-radius */
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
  padding: 15px 15px 15px;
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
  font-size: 14px;
  font-weight: 400;
}

.meta-layout--column {
  flex-direction: row; /* Sempre lado a lado */
}

.meta-layout--row {
  flex-direction: row;
  flex-wrap: wrap;
}

.meta-layout--stacked {
  display: flex;
  flex-direction: column;
  gap: 12px;

  /* Ajuste para alinhar ícones e texto */
  .meta-item {
    width: 100%;
  }
}

/* Meta com fonte maior e espaçamento quando não há preço */
.event-card__meta--no-price {
  font-size: 16px;
  margin-top: 8px;
  justify-content: center;

  .meta-icon {
    font-size: 18px;
  }
}

/* Body com padding extra quando não há preço */
.event-card__body--no-price {
  padding-top: 20px;
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
  flex-shrink: 0; /* Impede que a seção de preços seja comprimida */
}

.event-card__price-spacer {
  height: 2px; /* Altura da seção de preços para manter cards alinhados */
  flex-shrink: 0; /* Impede que o spacer seja comprimido */
}

.price-full {
  font-family: 'Poppins', sans-serif;
  font-size: 24px; /* tamanho 100 no design */
  font-weight: 600; /* Semibold */
  color: #000000;
  line-height: 1.2;
}

/* Preço quando não há parcelas (eventos com preço baixo) - mesmo tamanho para manter consistência */
.price-full--no-installments {
  font-family: 'Poppins', sans-serif;
  font-size: 24px;
  font-weight: 600; /* Semibold */
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
  .event-card-wrapper:has(.event-card--carousel) {
    flex: 0 0 280px;
    width: 280px;
  }

  .event-card--carousel {
    width: 100%;
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
  .event-card-wrapper:has(.event-card--carousel) {
    flex: 0 0 280px;
    width: 280px;
  }

  .event-card--carousel {
    width: 100%;
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

  /* Estilos para cards sem preço no mobile */
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
