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
            :ratio="1120 / 309"
            fit="cover"
            spinner-color="white"
            loading="eager"
          />
          <!-- Botão de share mobile (dentro da imagem) -->
          <q-btn
            unelevated
            rounded
            color="white"
            class="event-share event-share--mobile"
            aria-label="Compartilhar evento"
            @click="shareEvent"
          >
            <img src="/export.svg" alt="Compartilhar" class="share-icon" />
          </q-btn>
        </div>

        <q-card class="event-card">
          <div class="event-body">
            <div class="event-heading row items-center justify-between q-mb-lg">
              <div>
                <div class="text-h4 text-weight-bold text-white event-title">{{ event.title }}</div>
                <div v-if="event.highlight" class="event-highlight text-body2">
                  {{ event.highlight }}
                </div>
              </div>

              <!-- Botão de share desktop -->
              <q-btn
                unelevated
                rounded
                color="transparent"
                class="event-share event-share--desktop"
                aria-label="Compartilhar evento"
                @click="shareEvent"
              >
                <img src="/export.svg" alt="Compartilhar" class="share-icon share-icon--desktop" />
              </q-btn>
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

            <!-- Seção de Preços -->
            <div v-if="event.hasPrice" class="pricing-section q-mt-xl">
              <div class="pricing-info">
                <div
                  v-if="event.installments && event.installmentValue"
                  class="installment-details"
                >
                  <span class="installment-prefix">{{ event.installments }}x de</span>
                  <span class="installment-value">{{ event.formattedInstallmentValue }}</span>
                  <span class="installment-suffix">sem juros</span>
                </div>
                <div v-if="event.fullPrice" class="cash-price">
                  ou {{ event.formattedFullPrice }} à vista
                </div>
              </div>
            </div>

            <!-- Botão de Comprar -->
            <q-btn
              class="buy-btn"
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
              <div class="section-title">Descrição do Evento</div>
              <p class="section-text">{{ event.description }}</p>
            </div>

            <div v-if="event.additionalInfo" class="event-section q-mt-md">
              <div class="section-title">Informações Adicionais</div>
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
import { useSupabaseEvents } from 'src/composables/useSupabaseEvents'
import BreadcrumbNav from 'src/components/BreadcrumbNav.vue'
import RelatedEventsCarousel from 'src/components/RelatedEventsCarousel.vue'
import { useQuasar } from 'quasar'
const openingWhatsapp = ref(false)

const $q = useQuasar()

const DEFAULT_WHATSAPP_MESSAGE = 'Olá! Tenho interesse no evento.'

const route = useRoute()
const router = useRouter()

// Composable para gerenciar eventos do Supabase
const { fetchEventById, loading, error: apiError } = useSupabaseEvents()

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
  console.log('🏷️ Extraindo tags do evento:', eventData)

  // Tenta extrair tags de diferentes estruturas possíveis
  if (eventData.tags && Array.isArray(eventData.tags) && eventData.tags.length > 0) {
    console.log('✅ Tags encontradas no evento:', eventData.tags)
    return eventData.tags
  }

  // Se não há tags específicas, tenta inferir pela categoria baseada no título
  const title = (eventData.title || '').toLowerCase()
  console.log('📝 Inferindo tag pelo título:', title)

  if (title.includes('réveillon') || title.includes('reveillon') || title.includes('amoré')) {
    console.log('🎆 Tag inferida: REVEILLONS')
    return ['REVEILLONS'] // Tag correta do Supabase
  }
  if (title.includes('carnaval') || title.includes('carvalheira')) {
    console.log('🎭 Tag inferida: CARNAVAL')
    return ['CARNAVAL'] // Tag correta do Supabase
  }
  if (
    title.includes('são joão') ||
    title.includes('sao joao') ||
    title.includes('joão') ||
    title.includes('festival')
  ) {
    console.log('🎪 Tag inferida: FESTIVAISS')
    return ['FESTIVAISS'] // Tag correta do Supabase
  }

  // Padrão: Réveillon
  console.log('⚠️ Nenhuma tag específica encontrada, usando padrão: REVEILLONS')
  return ['REVEILLONS']
}
</script>

<style scoped>
.event-page {
  background-color: #2a3447;
  min-height: 100vh;
  padding: 40px 0 80px;
}

.event-container {
  width: 1120px;
  max-width: 100%;
  margin: 0 auto;
}

/* Hero grande com cantos arredondados e recorte */
.event-hero-wrap {
  /* Todas as bordas arredondadas */
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 24px;
  box-shadow: none;
  position: relative;
  width: 1120px;
  max-width: 100%;
  margin: 0 auto;
}

.event-hero {
  width: 1120px;
  max-width: 100%;
  height: 309px;
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
  border-radius: 24px;
  box-shadow: none;
}

.event-body {
  padding: 20px 36px 36px;
  color: #f9fafb;
}

/* Título mais destacado, estilo cartão grande */
.event-heading .text-h4 {
  font-size: 45.6px;
  line-height: 1.15;
}

/* Título do evento: Poppins Semibold 64, branco */
.event-title {
  color: #fff !important;
  font-family:
    'Poppins',
    system-ui,
    -apple-system,
    'Helvetica Neue',
    Arial,
    'Noto Sans',
    'Liberation Sans',
    sans-serif;
  font-weight: 600 !important; /* semibold */
}

.event-heading {
  gap: 16px;
  margin-bottom: 0;
  margin-left: -36px;
  margin-right: -36px;
  padding-left: 0;
  padding-right: 0; /* Pode ajustar se necessário */
}

.event-highlight {
  margin-top: 8px;
  color: #facc15;
}

.event-share {
  background: transparent !important;
  padding: 0;
  box-shadow: none !important;
}

.event-share--mobile {
  display: none;
}

.event-share--desktop {
  display: flex;
  width: 68px;
  height: 68px;
  min-width: 68px;
  min-height: 68px;
  align-items: center;
  justify-content: center;
  transform: translateY(-10px);
}

.share-icon {
  width: 64px;
  height: 64px;
  object-fit: contain;
}

.share-icon--desktop {
  width: 56px;
  height: 56px;
}

.event-meta {
  display: grid;
  gap: 24px;
  margin-top: 20px;
}

/* Remover a indentação dos meta-items */
.meta-item {
  display: flex;
  align-items: center;
  gap: 16px;
  background: transparent !important;
  padding: 16px 0;
  margin-left: 0; /* Garantir sem margem */
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

/* ==================== SEÇÃO DE PREÇOS ==================== */
.pricing-section {
  display: flex;
  justify-content: flex-end;
  margin: 24px 0;
  margin-left: -36px;
  margin-right: -36px;
  padding-left: 0;
  padding-right: 0;
  transform: translateY(-270px) translateX(-100px);
}

.pricing-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.installment-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.installment-prefix {
  font-size: 17.57px;
  font-weight: 500;
  color: white;
  line-height: 1.2;
}

.installment-value {
  font-size: 45.18px;
  font-weight: 700;
  color: white;
  line-height: 1;
}

.installment-suffix {
  font-size: 17.57px;
  font-weight: 500;
  color: white;
  line-height: 1.2;
}

.cash-price {
  font-size: 17.57px;
  font-weight: 500;
  color: #d1d5db;
  line-height: 0.5;
  margin-top: 24.66px; /* Distância exata conforme protótipo */
}

.buy-btn {
  width: 572px;
  height: 57px;
  border-radius: 10px !important;
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
  margin-left: auto;
  margin-right: auto;
  display: block;
  margin-top: -200px; /* Bem próximo */
  margin-bottom: 150px;
  background-color: #ffe100 !important;
  color: black !important;
}

.event-section {
  background: transparent; /* Sem fundo */
  padding: 24px 0; /* Remove padding horizontal para alinhar com o título */
  border-radius: 0; /* Remove border-radius */
}

.section-title {
  font-weight: 700;
  font-size: 24px;
  margin-bottom: 12px;
}

.section-text {
  margin: 0;
  color: #e5e7eb;
  font-size: 20px;
  line-height: 1.7;
}

@media (max-width: 1024px) {
  .event-container {
    width: calc(100vw - 40px);
  }

  .event-hero-wrap {
    width: 100%;
  }

  .event-hero {
    width: 100%;
    height: auto;
    min-height: 240px;
  }

  .event-body {
    padding: 24px;
  }

  .event-heading .text-h4 {
    font-size: 45.6px;
  }
}

@media (max-width: 599px) {
  .event-page {
    padding: 16px 0 60px;
    background-color: #2a3447;
  }

  .event-container {
    width: 100%;
    padding: 0 16px;
  }

  .event-toolbar {
    margin-bottom: 16px;
  }

  .back-button-container {
    gap: 8px;
    padding: 4px;
  }

  .back-icon {
    width: 40px;
    height: 40px;
  }

  .back-text {
    font-size: 14px;
  }

  .event-hero-wrap {
    border-radius: 16px;
    margin: 0 -16px 16px -16px;
  }

  .event-card {
    background: #2a3447;
    border-radius: 16px;
    box-shadow: none;
    margin: 0 -16px;
  }

  .event-body {
    padding: 24px 20px;
    background: #2a3447;
  }

  .event-hero-wrap {
    width: 100%;
    margin: 0;
  }

  .event-hero {
    width: 100%;
    height: auto;
    min-height: 180px;
  }

  .event-heading {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 24px;
  }

  .event-heading .text-h4 {
    font-size: 32px;
    line-height: 1.3;
  }

  .event-share--desktop {
    display: none;
  }

  .event-share--mobile {
    display: flex;
    position: absolute;
    top: 16px;
    right: 16px;
    background: white !important;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    min-width: 40px;
    min-height: 40px;
    padding: 0;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }

  .event-share--mobile .share-icon {
    width: 20px;
    height: 20px;
  }

  .event-meta {
    gap: 16px;
    margin-top: 16px;
  }

  .meta-item {
    flex-direction: row;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
  }

  .meta-badge {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    grid-template-rows: 18px 1fr;
    flex-shrink: 0;
  }

  .badge-month {
    font-size: 0.65rem;
    line-height: 18px;
  }

  .badge-day {
    font-size: 1.2rem;
  }

  .meta-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    flex-shrink: 0;
  }

  .meta-icon .q-icon {
    font-size: 24px;
  }

  .meta-title {
    font-size: 0.95rem;
    font-weight: 600;
  }

  .meta-subtitle {
    font-size: 0.85rem;
  }

  /* Responsividade para seção de preços */
  .pricing-section {
    justify-content: flex-start;
    transform: none;
    margin: 24px 0;
  }

  .pricing-info {
    align-items: flex-start;
    width: 100%;
  }

  .installment-details {
    align-items: flex-start;
    gap: 4px;
  }

  .installment-prefix {
    font-size: 14px;
    color: white;
  }

  .installment-value {
    font-size: 32px;
    color: white;
  }

  .installment-suffix {
    font-size: 14px;
    font-weight: 400;
    color: white;
    line-height: 1.2;
    margin-bottom: 0;
  }

  .cash-price {
    font-size: 14px;
    font-weight: 400;
    color: #d1d5db;
    line-height: 1.2;
    margin-top: 8px;
    margin-bottom: 0;
  }

  .buy-btn {
    width: 100%;
    height: 48px;
    border-radius: 8px !important;
    font-size: 16px;
    margin-top: 24px;
    margin-bottom: 24px;
    margin-left: 0;
    margin-right: 0;
  }

  .event-section {
    padding: 16px 0;
  }

  .section-title {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 12px;
  }

  .section-text {
    font-size: 14px;
    line-height: 1.6;
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
