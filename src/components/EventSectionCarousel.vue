<template>
  <section :id="sectionId" class="event-section">
    <!-- Cabecalho da secao com titulo, CTA e navegacao -->
    <div class="section-header">
      <div class="section-info">
        <div class="section-title">{{ title }}</div>
        <div class="section-divider">|</div>
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
          <button
            class="nav-btn"
            @click="scroll(-scrollStep)"
            :disabled="!canScrollLeft"
            aria-label="Navegar para eventos anteriores"
          >
            <img src="/LEFT.svg" alt="Anterior" />
          </button>
          <button
            class="nav-btn"
            @click="scroll(scrollStep)"
            :disabled="!canScrollRight"
            aria-label="Navegar para próximos eventos"
          >
            <img src="/RIGHT.svg" alt="Próximo" />
          </button>
        </div>
      </div>
    </div>

    <!-- Lista horizontal de cards -->
    <div
      class="cards-viewport"
      ref="viewport"
      @scroll="updateScrollState"
      :class="{
        'fade-right': showRightFade,
        'fade-left': showLeftFade,
      }"
    >
      <div class="cards-row">
        <EventCard
          v-for="card in items"
          :key="card.id"
          :event="card"
          variant="carousel"
          image-height="200px"
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
  sectionId: { type: String, default: null },
})

const viewport = ref(null)
const scrollStep = 344
const canScrollLeft = ref(false)
const canScrollRight = ref(false)
const showRightFade = ref(true)
const showLeftFade = ref(false)
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

  // Controla fade direito
  if (showRightFade.value) {
    if (el.scrollLeft >= FADE_HIDE_AT) showRightFade.value = false
  } else {
    if (el.scrollLeft <= FADE_SHOW_AT) showRightFade.value = true
  }

  // Controla fade esquerdo (aparece quando há scroll para a esquerda)
  if (el.scrollLeft > FADE_HIDE_AT) {
    showLeftFade.value = true
  } else {
    showLeftFade.value = false
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
  margin-top: 24px;
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
  gap: 4px;
}

.section-title {
  font-size: 1.35rem;
  font-weight: 700;
}

.section-divider {
  color: white;
  font-weight: 600;
  font-size: 1.2rem;
  margin: 0 2px;
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
  gap: 16px;
}

.nav-btn {
  width: 44px;
  height: 44px;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.2s ease;
  padding: 0;
}

.nav-btn:hover:not(:disabled) {
  opacity: 0.7;
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.nav-btn img {
  width: 44px;
  height: 44px;
  display: block;
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

.cards-viewport.fade-left {
  mask-image: linear-gradient(to right, transparent 0, #000 var(--fade));
  mask-repeat: no-repeat;
}

.cards-viewport.fade-left.fade-right {
  mask-image: linear-gradient(
    to right,
    transparent 0,
    #000 var(--fade),
    #000 calc(100% - var(--fade)),
    transparent 100%
  );
  mask-repeat: no-repeat;
}

.cards-row {
  --peek: calc(var(--card-width) * 2.62);
  display: flex;
  gap: 24px;
  align-items: stretch;
  padding-right: var(--peek);
}

/* Mobile */
@media (max-width: 599px) {
  .event-section {
    margin-top: 20px;
  }

  .section-header {
    margin-bottom: 16px;
  }

  .section-title {
    font-size: 1.15rem;
  }

  /* Remove o fade/transparência e permite cards estourarem o padding */
  .event-section {
    margin-left: -16px; /* estoura o padding do container pai pela esquerda */
    margin-right: -30px; /* estoura o padding do container pai pela direita */
    padding-left: 16px; /* mantém o alinhamento do header */
  }

  .section-header {
    margin-bottom: 16px;
    padding-right: 16px; /* compensa o estouro */
  }

  .cards-viewport {
    --fade: 24px; /* fade no mobile */
    scroll-padding-right: 0;
    margin: 0; /* sem margin */
    padding-left: 0; /* sem padding esquerdo */
    padding-right: 0; /* sem padding direito */
  }

  .cards-row {
    --peek: 0px; /* remove o peek, cards vão até a borda */
    gap: 16px;
    padding-left: 0; /* primeiro card cola na borda */
    padding-right: 16px; /* apenas o espaço do último card até a borda */
  }

  /* Esconde os botões de navegação no mobile */
  .nav-buttons {
    display: none;
  }
}

/* Tablet */
@media (min-width: 600px) and (max-width: 1023px) {
  .cards-viewport {
    --fade: 24px;
    scroll-padding-right: 160px;
  }

  .cards-row {
    --peek: calc(var(--card-width) * 0.5);
    gap: 20px;
  }
}

/* ==================== ACESSIBILIDADE - FOCUS STATES ==================== */
.nav-btn:focus-visible {
  outline: 2px solid #35c7ee;
  outline-offset: 2px;
  border-radius: 4px;
}

.see-all:focus-visible {
  outline: 2px solid #35c7ee;
  outline-offset: 2px;
}
</style>
