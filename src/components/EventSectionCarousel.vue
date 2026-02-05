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
        <!-- Botão Editar (apenas para admin) -->
        <q-btn
          v-if="isAdmin && editable && tagId && tagName"
          :label="isEditMode ? 'Salvar' : 'Editar'"
          :color="isEditMode ? 'positive' : 'warning'"
          size="sm"
          class="edit-btn"
          @click="
            async () => {
              isEditMode ? await exitEditMode() : await enterEditMode()
            }
          "
          aria-label="Ativar modo de edição do carrossel"
        />

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
        'fade-right': showRightFade && !isEditMode,
        'fade-left': showLeftFade && !isEditMode,
      }"
    >
      <div ref="cardsRow" class="cards-row" :class="{ 'cards-row--edit-mode': isEditMode }">
        <div
          v-for="card in displayedEvents"
          :key="card.id"
          :data-event-id="card.id"
          class="card-wrapper"
          :class="{ 'card-wrapper--dragging': isEditMode }"
        >
          <!-- Handle para drag (apenas no modo edição) -->
          <div v-if="isEditMode" class="drag-handle" title="Arraste para reordenar">⠿</div>

          <EventCard
            :event="card"
            variant="carousel"
            image-height="200px"
            :default-image="defaultImage"
            @click="openCard(card)"
            :style="{ pointerEvents: isEditMode ? 'none' : 'auto' }"
          />
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import Sortable from 'sortablejs'
import EventCard from './EventCard.vue'
import { useAuth } from 'src/composables/useAuth'
import { useAdminEvents } from 'src/composables/useAdminEvents'
import { useSupabaseEvents } from 'src/composables/useSupabaseEvents'

const router = useRouter()
const { isAdmin } = useAuth()
const { updateTagPriorities } = useAdminEvents()
const { fetchEventsByTag } = useSupabaseEvents()

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
  editable: { type: Boolean, default: false },
  tagId: { type: String, default: null, required: false },
  tagName: { type: String, default: null, required: false },
})

// Validação: se editable é true, tagId e tagName devem estar presentes
if (props.editable && (!props.tagId || !props.tagName)) {
  console.warn(
    `EventSectionCarousel: editable é true para "${props.title}" mas tagId ou tagName estão faltando. ` +
      'Modo de edição será desabilitado.',
  )
}

// Refs para edição e drag-and-drop
const viewport = ref(null)
const cardsRow = ref(null)
const isEditMode = ref(false)
const allEventsForEdit = ref([])
const sortableInstance = ref(null)
const debounceTimer = ref(null)

// Refs existentes
const scrollStep = 344
const canScrollLeft = ref(false)
const canScrollRight = ref(false)
const showRightFade = ref(true)
const showLeftFade = ref(false)
const FADE_SHOW_AT = 24
const FADE_HIDE_AT = 40

const hasCards = computed(() => props.items.length > 0)
const hasScrolled = ref(false)

// Determina qual lista de eventos exibir
const displayedEvents = computed(() => {
  return isEditMode.value ? allEventsForEdit.value : props.items
})

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

// Funções para edição e drag-and-drop
async function enterEditMode() {
  if (!props.tagId || !props.tagName) {
    console.error('tagId e tagName são necessários para ativar modo de edição')
    return
  }

  isEditMode.value = true

  try {
    // Busca TODOS os eventos da categoria sem limite
    const events = await fetchEventsByTag(props.tagName, { limit: 1000 })
    allEventsForEdit.value = events || []

    await nextTick()
    initSortable()
  } catch (err) {
    console.error('Erro ao carregar eventos para edição:', err)
    isEditMode.value = false
  }
}

function initSortable() {
  if (!cardsRow.value) return

  // Destroi instância anterior se existir
  if (sortableInstance.value) {
    sortableInstance.value.destroy()
  }

  sortableInstance.value = new Sortable(cardsRow.value, {
    animation: 150,
    ghostClass: 'card-ghost',
    dragClass: 'card-dragging',
    handle: '.drag-handle',
    onEnd: handleDragEnd,
  })
}

function handleDragEnd() {
  // Limpa timer anterior se houver
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }

  // Aguarda 500ms antes de salvar (debounce)
  debounceTimer.value = setTimeout(() => {
    saveEventOrder()
  }, 500)
}

async function saveEventOrder() {
  if (!cardsRow.value || !props.tagId) return

  try {
    // Coleta os IDs na nova ordem
    const children = Array.from(cardsRow.value.children)
    const newOrder = children.map((el) => el.dataset.eventId)

    // Sincroniza estado local com novo ordem do DOM
    // Isso evita revert visual se a página renderizar novamente
    if (newOrder.length > 0) {
      const orderMap = new Map(newOrder.map((id, idx) => [id, idx]))
      allEventsForEdit.value = allEventsForEdit.value.sort((a, b) => {
        const aIdx = orderMap.get(a.id) ?? 999
        const bIdx = orderMap.get(b.id) ?? 999
        return aIdx - bIdx
      })
    }

    // Salva no banco de dados
    await updateTagPriorities(props.tagId, newOrder)
  } catch (err) {
    console.error('Erro ao salvar ordem:', err)
  }
}

async function exitEditMode() {
  // Se houver debounce pendente, salva synchronously antes de sair
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
    debounceTimer.value = null

    try {
      // Aguarda o salvamento das mudanças pendentes
      await saveEventOrder()
    } catch (err) {
      console.error('Erro ao salvar ordem ao sair do modo de edição:', err)
      // Continua o exit mesmo se houver erro
    }
  }

  isEditMode.value = false
  allEventsForEdit.value = []

  // Destroi instância de Sortable após salvar
  if (sortableInstance.value) {
    sortableInstance.value.destroy()
    sortableInstance.value = null
  }
}

// Watchers
watch(
  () => props.items,
  async () => {
    // Não atualiza scroll state em modo edição
    if (isEditMode.value) return

    await nextTick()
    updateScrollState()
  },
)

onMounted(() => {
  if (!hasCards.value) return
  nextTick().then(updateScrollState)
})

// Cleanup ao desmontar
onUnmounted(() => {
  if (sortableInstance.value) {
    sortableInstance.value.destroy()
  }

  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
})
</script>

<style scoped>
/* ==================== BRUTAL EVENT SECTION CAROUSEL ==================== */
.event-section {
  margin-top: 32px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  color: #fafafa;
}

.section-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title {
  font-family: 'Poppins', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: -0.5px;
  color: #fafafa;
}

.section-divider {
  color: #FFE500;
  font-weight: 800;
  font-size: 1.4rem;
  margin: 0 4px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.see-all {
  margin-top: 0;
  padding: 8px 16px !important;
  min-width: auto;
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 13px;
  color: #1a1a1a !important;
  background: #FFE500 !important;
  border: 3px solid #1a1a1a !important;
  border-radius: 0 !important;
  box-shadow: 3px 3px 0px #1a1a1a;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  transition: all 0.15s ease !important;
}

.see-all:hover {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0px #1a1a1a;
}

.see-all:active {
  transform: translate(1px, 1px);
  box-shadow: 2px 2px 0px #1a1a1a;
}

.nav-buttons {
  display: flex;
  gap: 12px;
}

.nav-btn {
  width: 48px;
  height: 48px;
  background: #fafafa;
  border: 3px solid #1a1a1a;
  border-radius: 0;
  box-shadow: 4px 4px 0px #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  padding: 0;
}

.nav-btn:hover:not(:disabled) {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px #1a1a1a;
  background: #FFE500;
}

.nav-btn:active:not(:disabled) {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #1a1a1a;
}

.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: #e0e0e0;
}

.nav-btn img {
  width: 28px;
  height: 28px;
  display: block;
}

.cards-viewport {
  overflow-x: auto;
  overflow-y: visible;
  position: relative;
  scrollbar-width: none;
  --fade: 28px;
  scroll-padding-right: 200px;
  padding-top: 40px;
  padding-bottom: 16px;
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
  --card-width: 320px;
  --card-height: auto;
  --card-image-height: 200px;
  --peek: calc(var(--card-width) * 2.62);
  display: flex;
  gap: 24px;
  align-items: stretch;
  padding-right: var(--peek);
}

/* ==================== RESPONSIVE - BRUTAL ==================== */
/* Mobile */
@media (max-width: 599px) {
  .event-section {
    margin-top: 24px;
  }

  .section-header {
    margin-bottom: 16px;
    padding-left: 16px;
    padding-right: 16px;
  }

  .section-title {
    font-size: 1.2rem;
  }

  .section-divider {
    font-size: 1.1rem;
  }

  .see-all {
    padding: 6px 12px !important;
    font-size: 11px;
    box-shadow: 2px 2px 0px #1a1a1a;
  }

  .cards-viewport {
    --fade: 0px;
    scroll-padding-right: 0;
    margin: 0;
    margin-left: -16px;
    margin-right: -16px;
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 40px;
    padding-bottom: 13px;
  }

  .cards-viewport.fade-right,
  .cards-viewport.fade-left,
  .cards-viewport.fade-left.fade-right {
    mask-image: none;
  }

  .cards-row {
    --peek: 16px;
    --card-width: 280px;
    --card-height: 300px;
    --card-image-height: 140px;
    gap: 16px;
    padding-left: 0;
    padding-right: 0;
  }

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

  .nav-btn {
    width: 44px;
    height: 44px;
    box-shadow: 3px 3px 0px #1a1a1a;
  }

  .nav-btn img {
    width: 24px;
    height: 24px;
  }
}

/* ==================== ACESSIBILIDADE - BRUTAL FOCUS ==================== */
.nav-btn:focus-visible {
  outline: 3px solid #FFE500;
  outline-offset: 2px;
}

.see-all:focus-visible {
  outline: 3px solid #35c7ee;
  outline-offset: 2px;
}

/* ==================== DRAG-AND-DROP STYLES - BRUTAL ==================== */
.card-wrapper {
  position: relative;
  transition: all 0.15s ease;
}

.card-wrapper--dragging {
  cursor: grab;
}

.card-wrapper--dragging:active {
  cursor: grabbing;
}

.drag-handle {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
  cursor: grab;
  font-size: 20px;
  color: #1a1a1a;
  background: #FFE500;
  border: 3px solid #1a1a1a;
  border-radius: 0;
  box-shadow: 3px 3px 0px #1a1a1a;
  padding: 6px 10px;
  user-select: none;
  font-weight: 800;
  transition: all 0.15s ease;
}

.drag-handle:hover {
  background: #fafafa;
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0px #1a1a1a;
}

.drag-handle:active {
  cursor: grabbing;
  transform: translate(1px, 1px);
  box-shadow: 2px 2px 0px #1a1a1a;
}

.card-ghost {
  opacity: 0.5;
  border: 3px dashed #FFE500 !important;
  border-radius: 0 !important;
}

.card-dragging {
  opacity: 0.6;
  transform: rotate(2deg);
}

.cards-row--edit-mode {
  overflow-x: auto;
  padding-bottom: 16px;
}

.edit-btn {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  padding: 8px 20px !important;
  border: 3px solid #1a1a1a !important;
  border-radius: 0 !important;
  box-shadow: 3px 3px 0px #1a1a1a;
  text-transform: uppercase;
  transition: all 0.15s ease;
}

.edit-btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0px #1a1a1a;
}

.edit-btn:active {
  transform: translate(1px, 1px);
  box-shadow: 2px 2px 0px #1a1a1a;
}
</style>
