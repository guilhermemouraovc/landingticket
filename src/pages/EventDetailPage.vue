<template>
  <q-page class="event-page">
    <div class="event-container">
      <div class="event-toolbar">
        <div class="back-button-container" @click="goBack">
          <div class="back-icon">
            <q-icon name="arrow_back" size="24px" class="back-arrow-icon" />
          </div>
          <span class="back-text">Voltar</span>
        </div>
      </div>

      <!-- Breadcrumbs -->
      <BreadcrumbNav
        v-if="event"
        :crumbs="[
          { label: 'Início', to: '/', icon: 'home' },
          { label: event.title, to: null },
        ]"
      />

      <q-linear-progress v-if="loading" indeterminate color="warning" class="q-mt-xl" />

      <div v-else-if="error" class="event-error text-center" role="alert">
        <div class="text-h6 text-white q-mb-sm">{{ error }}</div>
        <q-btn
          color="warning"
          text-color="black"
          label="Voltar para inicio"
          aria-label="Voltar para página inicial"
          @click="goHome"
        />
      </div>

      <div v-else-if="event">
        <div class="event-hero-wrap">
          <q-img
            :src="event.image"
            :alt="`Imagem destacada do evento ${event.title}`"
            class="event-hero"
            height="440px"
            fit="cover"
            spinner-color="white"
            loading="eager"
          />
        </div>

        <q-card class="event-card">
          <div class="event-body">
            <div class="event-heading row items-start justify-between q-mb-lg">
              <div>
                <div class="text-h4 text-weight-bold text-white event-title">{{ event.title }}</div>
                <div v-if="event.highlight" class="event-highlight text-body2">
                  {{ event.highlight }}
                </div>
              </div>

              <q-btn
                unelevated
                rounded
                color="primary"
                icon="share"
                class="event-share"
                aria-label="Compartilhar evento"
                @click="shareEvent"
              />
            </div>

            <div class="event-meta">
              <div class="meta-item" role="group" aria-label="Data do evento">
                <div class="meta-badge text-center" aria-hidden="true">
                  <div class="badge-month">{{ event.dateBadge.month }}</div>
                  <div class="badge-day">{{ event.dateBadge.day }}</div>
                </div>

                <div>
                  <div class="meta-title">{{ event.dateLabel }}</div>
                  <div v-if="event.timeLabel" class="meta-subtitle">{{ event.timeLabel }}</div>
                </div>
              </div>

              <div class="meta-item" role="group" aria-label="Local do evento">
                <div class="meta-icon" aria-hidden="true">
                  <q-icon name="place" size="32px" />
                </div>

                <div>
                  <div class="meta-title">{{ event.location }}</div>
                  <div class="meta-subtitle">{{ event.cityState }}</div>
                </div>
              </div>
            </div>

            <q-btn
              class="buy-btn q-mt-xl"
              color="warning"
              text-color="black"
              label="Comprar"
              unelevated
              no-caps
              :loading="openingWhatsapp"
              aria-label="Comprar ingresso via WhatsApp"
              @click="openWhatsapp"
            >
              <template #loading>
                <q-spinner-dots size="20px" />
              </template>
            </q-btn>

            <div class="event-section q-mt-xl">
              <div class="section-title">Descricao do Evento</div>
              <p class="section-text">{{ event.description }}</p>
            </div>

            <div v-if="event.additionalInfo" class="event-section q-mt-md">
              <div class="section-title">Informacoes adicionais</div>
              <p class="section-text">{{ event.additionalInfo }}</p>
            </div>
          </div>
        </q-card>

        <!-- Carrossel de eventos relacionados -->
        <RelatedEventsCarousel
          v-if="event"
          :current-event-id="event.id"
          :event-tags="getEventTags(event)"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEvents } from 'src/composables/useEvents'
import BreadcrumbNav from 'src/components/BreadcrumbNav.vue'
import RelatedEventsCarousel from 'src/components/RelatedEventsCarousel.vue'
import { useQuasar } from 'quasar'
const openingWhatsapp = ref(false)

const $q = useQuasar()

const DEFAULT_WHATSAPP_MESSAGE = 'Olá! Tenho interesse no evento.'

const route = useRoute()
const router = useRouter()

// Composable para gerenciar eventos
const { fetchEventById, loading, error: apiError } = useEvents()

// Estado base da tela
const error = ref('')
const event = ref(null)

// Carrega evento inicial e reage a mudanças de rota
onMounted(() => {
  loadEvent(route.params.id)
})

watch(
  () => route.params.id,
  (id, previous) => {
    if (id && id !== previous) {
      loadEvent(id)
    }
  },
)

// Fluxo principal de obtenção de dados
async function loadEvent(idParam) {
  error.value = ''
  event.value = null

  try {
    const eventData = await fetchEventById(idParam)

    if (!eventData) {
      error.value = 'Evento não encontrado.'
      return
    }

    event.value = eventData
    console.log('image:', event.value.image)
  } catch (err) {
    console.error('Falha ao carregar evento', err)
    error.value = apiError.value || 'Não foi possível carregar os detalhes do evento.'
  }
}

// Utilitários de ação
function openWhatsapp() {
  if (!event.value) return

  openingWhatsapp.value = true

  const phone = event.value.whatsapp
  const message = encodeURIComponent(event.value.whatsappMessage || DEFAULT_WHATSAPP_MESSAGE)
  const base = phone ? 'https://wa.me/' + phone : 'https://wa.me/'
  const url = `${base}?text=${message}`

  if (typeof window !== 'undefined') {
    window.open(url, '_blank')
  }

  // Desativa loading após 500ms
  setTimeout(() => {
    openingWhatsapp.value = false
  }, 500)
}

function shareEvent() {
  if (!event.value || typeof window === 'undefined') return

  const shareUrl = event.value.shareUrl || window.location.href
  const shareData = {
    title: event.value.title,
    text: event.value.description,
    url: shareUrl,
  }

  if (navigator?.share) {
    navigator
      .share(shareData)
      .then(() => {
        $q.notify({
          type: 'positive',
          message: 'Evento compartilhado com sucesso!',
          position: 'top',
          timeout: 2000,
          icon: 'check_circle',
        })
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          $q.notify({
            type: 'warning',
            message: 'Não foi possível compartilhar',
            position: 'top',
            timeout: 2000,
          })
        }
      })
  } else if (navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(shareUrl).then(() => {
      $q.notify({
        type: 'negative',
        message: 'Erro ao copiar link',
        position: 'top',
        timeout: 2000,
      })
    })
  } else {
    $q.notify({
      type: 'info',
      message: 'Compartilhamento não disponível neste navegador',
      position: 'top',
      timeout: 3000,
    })
  }
}

function goBack() {
  if (typeof window !== 'undefined' && window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

function goHome() {
  router.push('/')
}

// Função para extrair tags do evento
function getEventTags(eventData) {
  // Tenta extrair tags de diferentes estruturas possíveis
  if (eventData.tags && Array.isArray(eventData.tags)) {
    return eventData.tags
  }

  // Se não há tags específicas, tenta inferir pela categoria baseada no título
  const title = (eventData.title || '').toLowerCase()

  if (title.includes('réveillon') || title.includes('reveillon') || title.includes('amoré')) {
    return ['REVEILLON']
  }
  if (title.includes('carnaval') || title.includes('carvalheira')) {
    return ['CARNAVAIS']
  }
  if (title.includes('são joão') || title.includes('sao joao') || title.includes('joão')) {
    return ['SaoJoao']
  }

  // Padrão: Réveillon
  return ['REVEILLON']
}
</script>

<style scoped>
.event-page {
  background-color: #2a3447;
  min-height: 100vh;
  padding: 40px 0 80px;
}

.event-container {
  width: min(1280px, calc(100vw - 160px));
  max-width: 1280px;
  margin: 0 auto;
}

/* Hero grande com cantos arredondados e recorte */
.event-hero-wrap {
  /* Unifica visualmente com o quadro de conteúdo */
  border-radius: 24px 24px 0 0;
  overflow: hidden;
  margin-bottom: 0;
  box-shadow: none;
}

.event-hero :where(.q-img__content, .q-img__image, img) {
  border-radius: inherit;
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.event-toolbar {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 24px;
}

.back-button-container {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.back-button-container:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.back-icon {
  width: 56px;
  height: 56px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.back-text {
  color: white;
  font-weight: 600;
  font-size: 16px;
  font-family:
    'Poppins',
    system-ui,
    -apple-system,
    sans-serif;
}

.toolbar-back {
  border-radius: 999px;
}

.event-error {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 32px;
}

.event-card {
  background: #2a3447;
  border-radius: 0 0 24px 24px;
  box-shadow: none;
}

.event-body {
  padding: 20px 36px 36px;
  color: #f9fafb;
}

/* Título mais destacado, estilo cartão grande */
.event-heading .text-h4 {
  font-size: 64px;
  line-height: 1.15;
}

/* Título do evento: Poppins Semibold 64, branco */
.event-title {
  color: #fff !important;
  font-family:
    'Poppins',
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    'Helvetica Neue',
    Arial,
    'Noto Sans',
    'Liberation Sans',
    sans-serif;
  font-weight: 600 !important; /* semibold */
}

.event-heading {
  gap: 16px;
}

.event-highlight {
  margin-top: 8px;
  color: #facc15;
}

.event-share {
  background: rgba(255, 255, 255, 0.12);
}

.event-meta {
  display: grid;
  gap: 24px;
  margin-top: 20px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 16px;
  background: transparent !important;
  padding: 16px 20px;
  border-radius: 0 !important;
  box-shadow: none !important;
}

.meta-badge {
  /* Tile 80x80 com topo magenta e sombra */
  width: 80px;
  height: 80px;
  background: #303b4f; /* leve contraste sobre #2A3447 */
  border-radius: 16px;
  box-shadow: 0 14px 24px rgba(0, 0, 0, 0.35);
  color: #ffffff;
  display: grid;
  grid-template-rows: 28px 1fr;
  overflow: hidden;
}

.badge-month {
  background: #d946ef; /* magenta */
  color: #fff;
  font-weight: 800;
  font-size: 0.9rem;
  line-height: 28px;
  text-align: center;
  text-transform: capitalize;
}

.badge-day {
  font-size: 1.8rem;
  line-height: 1;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.meta-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #303b4f;
  border-radius: 16px;
  box-shadow: 0 14px 24px rgba(0, 0, 0, 0.35);
  color: #d946ef; /* magenta no ícone */
}

.meta-title {
  font-size: 1.05rem;
  font-weight: 600;
}

.meta-subtitle {
  color: #d1d5db;
  font-size: 0.9rem;
}

.buy-btn {
  /* Centraliza e mantém 434px das extremidades em viewports >= 1440px */
  width: min(572px, calc(100vw - 868px));
  height: 57px;
  border-radius: 10px !important;
  font-size: 16px;
  font-weight: 600; /* semibold */
  line-height: 1;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.event-section {
  background: rgba(255, 255, 255, 0.04);
  padding: 24px;
  border-radius: 20px;
}

.section-title {
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 12px;
}

.section-text {
  margin: 0;
  color: #e5e7eb;
  line-height: 1.7;
}

@media (max-width: 1024px) {
  .event-container {
    width: calc(100vw - 40px);
  }

  .event-hero {
    height: 320px;
  }

  .event-body {
    padding: 24px;
  }

  .event-heading .text-h4 {
    font-size: 44px;
  }
}

@media (max-width: 599px) {
  .event-page {
    padding: 24px 0 60px;
  }

  .event-card {
    background: #2a3447;
    border-radius: 0 0 20px 20px;
    box-shadow: none;
  }

  .event-body {
    padding: 20px;
  }

  .event-hero {
    height: 220px;
  }

  .event-heading .text-h4 {
    font-size: 32px;
  }

  .meta-item {
    flex-direction: column;
    align-items: stretch;
  }

  .meta-badge,
  .meta-icon {
    width: 80px;
    height: 80px;
    border-radius: 16px;
  }
}

/* ==================== ACESSIBILIDADE - FOCUS STATES ==================== */
.q-btn:focus-visible {
  outline: 2px solid #35c7ee;
  outline-offset: 2px;
}

.toolbar-back:focus-visible {
  outline: 2px solid #35c7ee;
  outline-offset: 4px;
  border-radius: 999px;
}

.event-share:focus-visible {
  outline: 2px solid #35c7ee;
  outline-offset: 3px;
}

.buy-btn:focus-visible {
  outline: 3px solid #35c7ee;
  outline-offset: 3px;
}

.back-button-container:focus-visible {
  outline: 2px solid #35c7ee;
  outline-offset: 4px;
  border-radius: 8px;
}

.back-arrow-icon {
  color: #35c7ee !important;
}

.back-arrow-icon .q-icon {
  color: #35c7ee !important;
}

/* Garantir que a cor seja aplicada */
.back-icon .q-icon {
  color: #35c7ee !important;
}

.back-icon svg {
  width: 24px;
  height: 24px;
}
</style>
