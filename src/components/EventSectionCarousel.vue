<template>
  <section class="event-section">
    <!-- Cabecalho da secao com titulo, CTA e navegacao -->
    <div class="section-header">
      <div class="section-info">
        <div class="section-title">{{ title }}</div>
        <!-- Movido o botão Ver Tudo para cá, substituindo a contagem -->
        <q-btn
          v-if="seeAllLink"
          flat
          dense
          no-caps
          class="see-all"
          text-color="grey-4"
          :label="seeAllLabel"
          :aria-label="`Ver todos os eventos de ${title}`"
          :to="seeAllLink"
        />
      </div>

      <div class="header-actions">
        <!-- Removido o botão Ver Tudo daqui -->

        <div class="nav-buttons" role="group" aria-label="Controles de navegação do carrossel">
          <q-btn
            dense
            round
            color="white"
            text-color="primary"
            icon="chevron_left"
            class="nav-btn"
            aria-label="Navegar para eventos anteriores"
            :disable="!canScrollLeft"
            @click="scroll(-scrollStep)"
          />
          <q-btn
            dense
            round
            color="white"
            text-color="primary"
            icon="chevron_right"
            class="nav-btn"
            aria-label="Navegar para próximos eventos"
            :disable="!canScrollRight"
            @click="scroll(scrollStep)"
          />
        </div>
      </div>
    </div>

    <!-- Lista horizontal de cards -->
    <div
      class="cards-viewport"
      ref="viewport"
      @scroll="updateScrollState"
      :class="{ 'fade-right': showRightFade }"
    >
      <div class="cards-row">
        <EventCard
          v-for="card in items"
          :key="card.id"
          :event="card"
          variant="carousel"
          image-height="220px"
          :default-image="defaultImage"
          @click="openCard(card)"
        />
      </div>
    </div>
  </section>
</template>
<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import EventCard from './EventCard.vue'
const router = useRouter()
function openCard(card) {
  const to = card?.link
  if (to) router.push(to)
}

const props = defineProps({
  title: { type: String, required: true },
  items: { type: Array, default: () => [] },
  seeAllLabel: { type: String, default: 'Ver Tudo' },
  seeAllLink: { type: [String, Object], default: null },
  defaultImage: { type: String, default: 'https://via.placeholder.com/400x200?text=Evento' },
})

const viewport = ref(null)
const scrollStep = 344
const canScrollLeft = ref(false)
const canScrollRight = ref(false)
const showRightFade = ref(true)
const FADE_SHOW_AT = 24
const FADE_HIDE_AT = 40

const hasCards = computed(() => props.items.length > 0)
const hasScrolled = ref(false)
function updateScrollState() {
  const el = viewport.value
  if (!el) return
  const maxScrollLeft = el.scrollWidth - el.clientWidth - 1
  canScrollLeft.value = el.scrollLeft > 0
  canScrollRight.value = el.scrollLeft < maxScrollLeft
  hasScrolled.value = el.scrollLeft > 0
  if (showRightFade.value) {
    if (el.scrollLeft >= FADE_HIDE_AT) showRightFade.value = false
  } else {
    if (el.scrollLeft <= FADE_SHOW_AT) showRightFade.value = true
  }
}

function scroll(offset) {
  const el = viewport.value
  if (!el) return
  el.scrollBy({ left: offset, behavior: 'smooth' })
}

watch(
  () => props.items,
  async () => {
    await nextTick()
    updateScrollState()
  },
)

onMounted(() => {
  if (!hasCards.value) return
  nextTick().then(updateScrollState)
})
</script>

<style scoped>
.event-section {
  margin-top: 56px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  color: white;
}

.section-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title {
  font-size: 1.35rem;
  font-weight: 700;
}

.section-divider {
  color: rgba(255, 255, 255, 0.4);
  font-weight: 500;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.see-all {
  margin-top: 4px;
  padding: 0;
  min-width: auto;
  font-weight: 600;
  color: #9ca3af;
}

.nav-buttons {
  display: flex;
  gap: 8px;
}

.nav-btn {
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.25);
}

.cards-viewport {
  overflow-x: auto;
  overflow-y: visible;
  position: relative;
  scrollbar-width: none;
  --fade: 28px; /* largura do fade */
  scroll-padding-right: 200px;
  padding-top: 9px;
  padding-bottom: 13px;
}

.cards-viewport::-webkit-scrollbar {
  display: none;
}

.cards-viewport.fade-right {
  mask-image: linear-gradient(to right, #000 calc(100% - var(--fade)), transparent 100%);
  mask-repeat: no-repeat;
}

.cards-row {
  --peek: calc(var(--card-width) * 2.62);
  display: flex;
  gap: 24px;
  align-items: stretch;
  padding-right: var(--peek);
}

/* Responsividade: ajustar peek em telas menores */
@media (max-width: 768px) {
  .cards-viewport {
    --fade: 24px;
    scroll-padding-right: 160px;
  }

  .cards-row {
    --peek: calc(var(--card-width) * 0.5);
  }
}

/* ==================== ACESSIBILIDADE - FOCUS STATES ==================== */
.nav-btn:focus-visible {
  outline: 2px solid #35c7ee;
  outline-offset: 2px;
}

.see-all:focus-visible {
  outline: 2px solid #35c7ee;
  outline-offset: 2px;
}
</style>
