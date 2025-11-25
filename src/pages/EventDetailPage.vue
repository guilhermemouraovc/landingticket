<template>
  <q-page class="event-page">
    <div class="event-container">
      <!-- Toolbar ajustada para suportar botão de edição à direita -->
      <div class="event-toolbar row justify-between items-center">
        <BackButton :use-history="true" />

        <q-btn
          v-if="isAdmin"
          color="primary"
          icon="edit"
          label="Editar Evento"
          @click="openEditDialog"
          class="q-ml-sm"
        />
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

            <div v-if="event.additionalInfo" class="event-section q-mt-md">
              <div class="section-title">Atrações</div>
              <p class="section-text" v-html="event.additionalInfo"></p>
            </div>

            <div class="event-section q-mt-md">
              <div class="section-title">Descrição do Evento</div>
              <p class="section-text" v-html="event.description"></p>
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

    <!-- Dialog de Edição (Admin) -->
    <q-dialog v-model="showEditDialog" :maximized="$q.screen.lt.md" persistent>
      <q-card :style="$q.screen.lt.md ? '' : 'min-width: 70vw; max-width: 90vw'">
        <q-card-section class="row items-center q-pb-none bg-primary text-white">
          <div class="text-h6">Editar Evento</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pt-md scroll" style="max-height: 80vh">
          <EventForm
            v-if="showEditDialog && eventToEdit"
            :event="eventToEdit"
            :tags="allTags"
            @save="handleSave"
            @cancel="showEditDialog = false"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSupabaseEvents } from 'src/composables/useSupabaseEvents'
import { useInfluencerTracking } from 'src/composables/useInfluencerTracking'
import BreadcrumbNav from 'src/components/BreadcrumbNav.vue'
import RelatedEventsCarousel from 'src/components/RelatedEventsCarousel.vue'
import BackButton from 'src/components/BackButton.vue'
import { useQuasar } from 'quasar'

// Admin imports
import { useAuth } from 'src/composables/useAuth'
import { useAdminEvents } from 'src/composables/useAdminEvents'
import { useSupabaseTags } from 'src/composables/useSupabaseTags'
import EventForm from 'src/components/EventForm.vue'

const openingWhatsapp = ref(false)

const $q = useQuasar()

const DEFAULT_WHATSAPP_MESSAGE = 'Olá! Tenho interesse no evento.'

const route = useRoute()
const router = useRouter()

// Composable para gerenciar eventos do Supabase
const { fetchEventById, loading, error: apiError } = useSupabaseEvents()

// Admin composables
const { isAdmin, initSession } = useAuth()
const { fetchEventById: fetchAdminEventById } = useAdminEvents() // Precisamos buscar a versão RAW do evento para o form
const { fetchTags } = useSupabaseTags()

// Composable para gerenciar tracking de influenciadoras
const { hasInfluencer, getWhatsAppMessage, getInfluencerPhone, saveInfluencer } =
  useInfluencerTracking()

// Estado base da tela
const error = ref('')
const event = ref(null)

// Admin state
const showEditDialog = ref(false)
const eventToEdit = ref(null)
const allTags = ref([])

// Carrega evento inicial e reage a mudanças de rota
onMounted(async () => {
  // Verifica se há parâmetro ref na URL (ex: ?ref=lauany)
  const refParam = route.query.ref
  if (refParam) {
    saveInfluencer(refParam)
    // Limpa o parâmetro da URL para deixar ela limpa
    router.replace({
      name: 'event-detail',
      params: { slug: route.params.slug },
    })
  }

  // Inicializa sessão para verificar admin
  await initSession()

  loadEvent(route.params.slug)
})

watch(
  () => route.params.slug,
  (slug, previous) => {
    if (slug && slug !== previous) {
      loadEvent(slug)
    }
  },
)

// Fluxo principal de obtenção de dados
async function loadEvent(slugParam) {
  error.value = ''
  event.value = null

  try {
    const eventData = await fetchEventById(slugParam)

    if (!eventData) {
      error.value = 'Evento não encontrado.'
      return
    }

    event.value = eventData

    // Atualiza a URL se ainda estiver usando ID (redireciona para slug)
    if (eventData.slug && route.params.slug !== eventData.slug) {
      router.replace({ name: 'event-detail', params: { slug: eventData.slug } })
    }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('Falha ao carregar evento', err)
    }
    error.value = apiError.value || 'Não foi possível carregar os detalhes do evento.'
  }
}

// Admin functions
async function openEditDialog() {
  if (!event.value) return

  try {
    // Carrega tags se necessário
    if (allTags.value.length === 0) {
      allTags.value = await fetchTags()
    }

    // Busca o evento raw (sem formatação) para edição
    // Precisamos do ID real, que deve estar no objeto formatado 'event.value.id'
    const rawEvent = await fetchAdminEventById(event.value.id)
    eventToEdit.value = rawEvent
    showEditDialog.value = true
  } catch (err) {
    console.error('Erro ao preparar edição:', err)
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar dados para edição',
    })
  }
}

async function handleSave() {
  showEditDialog.value = false
  eventToEdit.value = null
  // Recarrega o evento atual
  await loadEvent(route.params.slug)
}

// Utilitários de ação
function openWhatsapp() {
  if (!event.value) return

  openingWhatsapp.value = true

  // Verifica se há tracking de influenciadora
  let phone = event.value.whatsapp
  let message = event.value.whatsappMessage || DEFAULT_WHATSAPP_MESSAGE

  if (hasInfluencer()) {
    // Usa número fixo e mensagem personalizada para influenciadoras
    phone = getInfluencerPhone()
    message = getWhatsAppMessage(event.value.title) || message
  }

  const encodedMessage = encodeURIComponent(message)
  const base = phone ? 'https://wa.me/' + phone : 'https://wa.me/'
  const url = `${base}?text=${encodedMessage}`

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

  // Verifica se a Web Share API está disponível (funciona no Safari mobile iOS 12.2+)
  if (navigator.share && typeof navigator.share === 'function') {
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
        // AbortError significa que o usuário cancelou - não mostra erro
        if (error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
          // Se falhar, tenta copiar para clipboard como fallback
          copyToClipboard(shareUrl)
        }
      })
  } else if (navigator.clipboard && navigator.clipboard.writeText) {
    // Fallback: copia para clipboard
    copyToClipboard(shareUrl)
  } else {
    // Fallback final: método legado para navegadores mais antigos
    copyToClipboardLegacy(shareUrl)
  }
}

// Função auxiliar para copiar para clipboard
function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      $q.notify({
        type: 'positive',
        message: 'Link copiado para a área de transferência!',
        position: 'top',
        timeout: 2000,
        icon: 'content_copy',
      })
    })
    .catch(() => {
      // Se falhar, tenta método legado
      copyToClipboardLegacy(text)
    })
}

// Método legado para navegadores sem Clipboard API
function copyToClipboardLegacy(text) {
  try {
    // Cria um elemento temporário para copiar
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)

    if (successful) {
      $q.notify({
        type: 'positive',
        message: 'Link copiado para a área de transferência!',
        position: 'top',
        timeout: 2000,
        icon: 'content_copy',
      })
    } else {
      throw new Error('Falha ao copiar')
    }
  } catch {
    $q.notify({
      type: 'warning',
      message: 'Não foi possível copiar o link. Tente manualmente.',
      position: 'top',
      timeout: 3000,
      icon: 'warning',
    })
  }
}

function goHome() {
  router.push('/')
}

// Função para extrair tags do evento
function getEventTags(eventData) {
  // Tenta extrair tags de diferentes estruturas possíveis
  if (eventData.tags && Array.isArray(eventData.tags) && eventData.tags.length > 0) {
    return eventData.tags
  }

  // Se não há tags específicas, tenta inferir pela categoria baseada no título
  const title = (eventData.title || '').toLowerCase()

  if (title.includes('réveillon') || title.includes('reveillon') || title.includes('amoré')) {
    return ['REVEILLONS'] // Tag correta do Supabase
  }
  if (title.includes('carnaval') || title.includes('carvalheira')) {
    return ['CARNAVAL'] // Tag correta do Supabase
  }
  if (
    title.includes('são joão') ||
    title.includes('sao joao') ||
    title.includes('joão') ||
    title.includes('festival')
  ) {
    return ['FESTIVAIS'] // Tag correta do Supabase
  }

  // Padrão: Réveillon
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
  /* justify-content: flex-start; -- Removido para usar classes do Quasar no template */
  margin-bottom: 24px;
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
  transition: none !important;
}

.event-share:hover {
  transform: none !important;
  opacity: 1 !important;
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
  transition: none !important;
}

.event-share--desktop:hover {
  transform: translateY(-10px) !important;
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
  gap: 0px;
  margin-top: 20px;
  margin-bottom: 40px;
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
  width: 70px;
  height: 70px;
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
  font-size: 1.5rem;
  line-height: 1;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.meta-icon {
  width: 70px;
  height: 70px;
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
  transform: translateY(-215px) translateX(-100px);
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
  margin-top: 24px; /* Distância exata conforme protótipo */
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
  margin-top: -130px; /* Bem próximo */
  margin-bottom: 0px;
  background-color: #ffe100 !important;
  color: black !important;
}

.buy-btn:hover {
  background-color: #c3ac02 !important;
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
  white-space: pre-line;
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

  .event-hero-wrap {
    border-radius: 16px;
    margin: 0 0 16px 0;
    width: 100%;
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

  .event-hero {
    width: 100%;
    height: auto;
    min-height: 180px;
  }

  .event-heading {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 24px;
    margin-left: 0;
    margin-right: 0;
    padding-left: 0;
    padding-right: 0;
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
    background: #f5f5f5 !important;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    min-width: 40px;
    min-height: 40px;
    padding: 0;
    align-items: center;
    justify-content: center;
    z-index: 10;
    outline: 2px solid #35c7ee;
    outline-offset: 0;
  }

  .event-share--mobile .share-icon {
    width: 30px;
    height: 30px;
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
    margin-top: 40px;
    margin-bottom: 24px;
    margin-left: 0;
    margin-right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .buy-btn .q-btn__content {
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    padding: 0;
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
    white-space: pre-line;
  }
}

/* ==================== ACESSIBILIDADE - FOCUS STATES ==================== */
.q-btn:focus-visible {
  outline: 2px solid #35c7ee;
  outline-offset: 2px;
}

.event-share:focus-visible {
  outline: 2px solid #35c7ee;
  outline-offset: 3px;
}

.buy-btn:focus-visible {
  outline: 3px solid #35c7ee;
  outline-offset: 3px;
}
</style>
