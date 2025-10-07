<template>
  <section class="event-section">
    <!-- Cabecalho da secao com titulo, CTA e navegacao -->
    <div class="section-header">
      <div class="section-info">
        <div class="section-title">{{ title }}</div>
        <div v-if="items.length" class="section-divider">/ {{ items.length }} eventos</div>
      </div>

      <div class="header-actions">
        <q-btn
          v-if="seeAllLink"
          flat
          dense
          no-caps
          class="see-all"
          text-color="grey-4"
          :label="seeAllLabel"
          :to="seeAllLink"
        />

        <div class="nav-buttons">
          <q-btn
            dense
            round
            color="white"
            text-color="primary"
            icon="chevron_left"
            class="nav-btn"
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
        <q-card
          v-for="card in items"
          :key="card.id"
          class="event-card"
          flat
          bordered
          clickable
          v-ripple
          @click="openCard(card)"
          role="button"
          tabindex="0"
          :to="card.link"
        >
          <q-img
            :src="card.image || defaultImage"
            class="event-card__image"
            height="220px"
            ratio="16/9"
            spinner-color="white"
          />

          <q-card-section class="event-card__body">
            <div class="card-title text-weight-bold">{{ card.title }}</div>

            <div class="card-meta q-mt-md">
              <div class="meta-item">
                <q-icon name="event" size="18px" />
                <span class="meta-highlight">{{ card.date }}</span>
              </div>
              <div class="meta-item">
                <q-icon name="place" size="18px" />
                <span>{{ card.location }}</span>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </section>
</template>
<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
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
// dynamic scroll step based on measured card width\nconst CARD_GAP = 24\nconst measuredWidth = ref(360)\nconst scrollStep = computed(() => Math.round(measuredWidth.value + CARD_GAP))
const canScrollLeft = ref(false)
const canScrollRight = ref(false)
const showRightFade = ref(true)
const FADE_SHOW_AT = 24
const FADE_HIDE_AT = 40

const hasCards = computed(() => props.items.length > 0)
const hasScrolled = ref(false)
function measureCard()\n    updateScrollState() {
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

function measureCard() {
  const el = viewport.value
  const card = el?.querySelector('.event-card')
  if (card) measuredWidth.value = card.getBoundingClientRect().width
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
    measureCard()\n    updateScrollState()
  },
)

onMounted(() => {
  if (!hasCards.value) return
  nextTick().then(() => {\n    measureCard()\n    measureCard()\n    updateScrollState()\n  })
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
  --fade: 20px; /* largura do fade */
  scroll-padding-right: 140px;
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
  --card-width: 320px;
  display: flex;
  gap: 24px;
  align-items: stretch;
  padding-right: calc(var(--card-width) * 0.45);
}

.event-card {
  cursor: pointer;
  flex: 0 0 var(--card-width);
  width: var(--card-width);
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 16px -12px rgba(15, 23, 42, 0.28);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  overflow: hidden;
}

.event-card:hover,
.event-card:focus-within {
  transform: translateY(-4px);
  box-shadow: 0 24px 40px -12px rgba(15, 23, 42, 0.36);
}

.event-card__body {
  flex: 1;
  padding: 20px 22px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: #1f2937;
}

.card-title {
  font-size: 1.05rem;
  line-height: 1.35;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #6b7280;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
}

.meta-highlight {
  color: #ec4899;
  font-weight: 600;
}

.card-actions {
  padding: 0 22px 22px;
}
</style>



