<template>
  <section class="event-section">
    <!-- Cabeçalho da seção com título, CTA e navegação -->
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
        <div v-for="card in items" :key="card.id" class="event-card">
          <q-img
            :src="card.image || defaultImage"
            class="card-image"
            ratio="16/9"
            spinner-color="white"
          />
          <div class="card-body">
            <div class="card-title text-weight-bold">{{ card.title }}</div>

            <div class="card-meta q-mt-md">
              <div class="meta-item">
                <q-icon name="event" size="18px" />
                <span>{{ card.date }}</span>
              </div>
              <div class="meta-item">
                <q-icon name="place" size="18px" />
                <span>{{ card.location }}</span>
              </div>
            </div>

            <div class="card-actions q-mt-md">
              <q-btn
                outline
                color="primary"
                text-color="primary"
                label="Ver detalhes"
                no-caps
                rounded
                dense
                :to="card.link || '#'"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  items: { type: Array, default: () => [] },
  seeAllLabel: { type: String, default: 'Ver Tudo' },
  seeAllLink: { type: [String, Object], default: null },
  defaultImage: { type: String, default: 'https://via.placeholder.com/400x200?text=Evento' },
})

const viewport = ref(null)
const scrollStep = 420
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
  position: relative;
  scrollbar-width: none;
  --fade: 20px; /* largura do fade */
  scroll-padding-right: var(--fade);
}

.cards-viewport.fade-right {
  mask-image: linear-gradient(to right, #000 calc(100% - var(--fade)), transparent 100%);
  mask-image: linear-gradient(to right, #000 calc(100% - var(--fade)), transparent 100%);
  mask-repeat: no-repeat;
  mask-repeat: no-repeat;
}

.cards-row {
  display: flex;
  gap: 24px;
  align-items: stretch;
}

.event-card {
  flex: 0 0 400px;
  min-height: 395px;
  background: #fff;
  border-radius: 28px;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.22);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.card-image {
  width: 100%;
  height: 200px;
}

.card-body {
  flex: 1;
  padding: 18px 20px 22px;
  display: flex;
  flex-direction: column;
  color: #1f2937;
}

.card-title {
  font-size: 1.1rem;
  line-height: 1.35;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #6b7280;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
}

.card-actions {
  margin-top: auto;
}
</style>
