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

            <!-- Seção de Ingressos (Múltiplos Dias) -->
            <div v-if="event.days && event.days.length > 0" class="tickets-section q-mt-xl">
              <div class="text-h5 text-white text-weight-bold q-mb-lg">Ingressos Disponíveis</div>

              <div class="tickets-carousel-wrapper relative-position">
                <!-- Botão Anterior -->
                <q-btn
                  round
                  flat
                  :ripple="false"
                  color="white"
                  icon="chevron_left"
                  class="carousel-btn prev-btn"
                  @click="scrollTickets('left')"
                />

                <div ref="ticketsContainer" class="tickets-scroll-container row no-wrap">
                  <div
                    v-for="(day, index) in event.days"
                    :key="day.id"
                    class="ticket-item-column"
                    :class="{ 'no-border': index === event.days.length - 1 }"
                  >
                    <!-- Data Header -->
                    <div class="ticket-header q-mb-sm">
                      <div class="text-h6 text-weight-bold text-white ticket-day-title">
                        {{ day.label }}
                      </div>
                    </div>

                    <!-- Meta Info (Data Evento e Local) - Na mesma linha -->
                    <div class="ticket-meta row items-center q-mb-md q-gutter-x-md">
                      <div class="row items-center">
                        <q-icon name="calendar_today" class="text-magenta q-mr-xs" size="16px" />
                        <span class="text-grey-5 text-caption text-weight-medium">
                          {{ day.formattedDateShort || event.date || 'Data a definir' }}
                        </span>
                      </div>
                      <div class="row items-center">
                        <q-icon name="location_on" class="text-magenta q-mr-xs" size="16px" />
                        <span class="text-grey-5 text-caption text-weight-medium">
                          {{ event.cityState || 'Local a definir' }}
                        </span>
                      </div>
                    </div>

                    <!-- Preço -->
                    <div class="ticket-price-info q-mt-auto">
                      <div v-if="day.hasPrice">
                        <div
                          class="text-h4 text-weight-bold text-white"
                          :class="{
                            'ticket-price--no-installments': !day.shouldShowInstallments,
                          }"
                        >
                          {{ day.formattedFullPrice }}
                        </div>
                        <div
                          v-if="day.shouldShowInstallments && day.installments"
                          class="ticket-installments text-grey-5"
                        >
                          Ou até {{ day.installments }}x {{ day.formattedInstallmentValue }}
                          sem juros
                        </div>
                      </div>
                      <div v-else class="text-h5 text-white">Consulte</div>
                    </div>
                  </div>
                </div>

                <!-- Botão Próximo -->
                <q-btn
                  round
                  flat
                  :ripple="false"
                  color="white"
                  icon="chevron_right"
                  class="carousel-btn next-btn"
                  @click="scrollTickets('right')"
                />
              </div>

              <!-- Botão de Comprar (Global da Seção) -->
              <div class="row justify-center q-mt-lg">
                <q-btn
                  class="multi-day-buy-btn"
                  color="warning"
                  text-color="black"
                  label="Comprar"
                  unelevated
                  no-caps
                  :loading="openingWhatsapp"
                  aria-label="Comprar ingresso via WhatsApp"
                  @click="openWhatsapp()"
                />
              </div>
            </div>

            <!-- Seção de Preços (Único Dia) -->
            <div v-else-if="event.hasPrice" class="pricing-section q-mt-xl">
              <div class="pricing-info">
                <!-- Parcelas (apenas se relevante: preço >= R$100 e mais de 1 parcela) -->
                <div
                  v-if="
                    event.shouldShowInstallments && event.installments && event.installmentValue
                  "
                  class="installment-details"
                >
                  <span class="installment-prefix">{{ event.installments }}x de</span>
                  <span class="installment-value">{{ event.formattedInstallmentValue }}</span>
                  <span class="installment-suffix">sem juros</span>
                  <!-- Preço à vista logo abaixo de "sem juros" -->
                  <div v-if="event.fullPrice" class="cash-price">
                    ou {{ event.formattedFullPrice }} à vista
                  </div>
                </div>
                <!-- Preço à vista destacado quando não há parcelas -->
                <div v-else-if="event.fullPrice" class="cash-price cash-price--no-installments">
                  {{ event.formattedFullPrice }}
                </div>
                <!-- Texto alternativo quando não há parcelas -->
                <div v-if="!event.shouldShowInstallments" class="payment-info">
                  No PIX ou no cartão
                </div>
              </div>
            </div>

            <!-- Botão de Comprar (Único Dia) -->
            <q-btn
              v-if="!event.days || event.days.length === 0"
              class="buy-btn"
              color="warning"
              text-color="black"
              label="Comprar"
              unelevated
              no-caps
              :loading="openingWhatsapp"
              aria-label="Comprar ingresso via WhatsApp"
              @click="openWhatsapp()"
            />

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

        <!-- Card de Newsletter -->
        <div class="newsletter-card">
          <div class="newsletter-content">
            <div class="newsletter-text">
              <p class="newsletter-title">
                Quer ficar por dentro das novidades sobre os eventos que estão rolando em PE?
                <span class="newsletter-highlight">Faça parte da Newsletter Ticketpe!</span>
              </p>
            </div>
            <div class="newsletter-form">
              <label for="newsletter-email" class="newsletter-label">Digite seu e-mail</label>
              <q-input
                id="newsletter-email"
                v-model="newsletterEmail"
                type="email"
                placeholder="exemplo@gmail.com"
                outlined
                dense
                dark
                class="newsletter-input"
                :rules="[(val) => !val || /.+@.+\..+/.test(val) || 'E-mail inválido']"
                aria-label="Digite seu e-mail para newsletter"
              />
              <q-btn
                class="newsletter-btn"
                color="cyan"
                text-color="white"
                label="Inscrever-se"
                unelevated
                no-caps
                :loading="newsletterLoading"
                :disable="!newsletterEmail || newsletterLoading"
                @click="subscribeNewsletter"
              />
            </div>
          </div>
        </div>

        <!-- Carrossel de eventos relacionados -->
        <RelatedEventsCarousel
          v-if="event"
          :current-event-id="event.id"
          :event-tags="getEventTags(event)"
        />
      </div>
    </div>

    <!-- Botão Flutuante de Compra -->
    <transition name="floating-bar">
      <div v-if="event" class="floating-buy-bar">
        <div class="floating-buy-content">
          <div class="floating-buy-info">
            <div class="floating-buy-title">{{ event.title }}</div>
            <div class="floating-buy-price">
              <span class="floating-price-value">{{ event.formattedFullPrice || 'Consulte' }}</span>
              <span
                v-if="event.shouldShowInstallments && event.installments && event.installmentValue"
                class="floating-price-installments"
              >
                Ou até {{ event.installments }}x {{ event.formattedInstallmentValue }} sem juros
              </span>
            </div>
          </div>
          <q-btn
            class="floating-buy-btn"
            color="warning"
            text-color="black"
            label="Comprar"
            unelevated
            no-caps
            :loading="openingWhatsapp"
            aria-label="Comprar ingresso via WhatsApp"
            @click="openWhatsapp()"
          />
        </div>
      </div>
    </transition>

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
import {
  useSEO,
  createEventStructuredData,
  createBreadcrumbStructuredData,
} from 'src/composables/useSEO'

// Admin imports
import { useAuth } from 'src/composables/useAuth'
import { useAdminEvents } from 'src/composables/useAdminEvents'
import { useSupabaseTags } from 'src/composables/useSupabaseTags'
import EventForm from 'src/components/EventForm.vue'

const openingWhatsapp = ref(false)

const $q = useQuasar()

// Função para gerar mensagem padrão do WhatsApp com nome do evento
function getDefaultWhatsAppMessage(eventTitle, hasRef = false) {
  if (hasRef) {
    return null // Será tratado pelo composable de influenciadora
  }
  return `Olá! Gostaria de finalizar a compra do ${eventTitle}`
}

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
const selectedDay = ref(null)
const ticketsContainer = ref(null)

// Newsletter state
const newsletterEmail = ref('')
const newsletterLoading = ref(false)

function scrollTickets(direction) {
  if (!ticketsContainer.value) return
  const scrollAmount = 300
  if (direction === 'left') {
    ticketsContainer.value.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
  } else {
    ticketsContainer.value.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }
}

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

    // Seleciona o primeiro dia por padrão se houver dias
    if (eventData.days && eventData.days.length > 0) {
      selectedDay.value = eventData.days[0]
    }

    // Atualiza SEO dinamicamente
    updateEventSEO(eventData)
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('Falha ao carregar evento', err)
    }
    error.value = apiError.value || 'Não foi possível carregar os detalhes do evento.'
  }
}

// Função para atualizar SEO do evento
function updateEventSEO(eventData) {
  if (!eventData) return

  const baseUrl = 'https://ticketpe.com.br'
  const eventUrl = eventData.shareUrl || `${baseUrl}/event/${eventData.slug || eventData.id}`

  // Extrai descrição (primeiros 160 caracteres)
  const description = eventData.description
    ? eventData.description.replace(/<[^>]*>/g, '').substring(0, 160) + '...'
    : `Ingressos para ${eventData.title} em ${eventData.cityState || 'Pernambuco'}. Reserve já no Ticketpe!`

  // Cria structured data do evento
  const eventStructuredData = createEventStructuredData(eventData)

  // Cria structured data de breadcrumbs
  const breadcrumbStructuredData = createBreadcrumbStructuredData([
    { label: 'Início', url: baseUrl },
    { label: eventData.title, url: eventUrl },
  ])

  // Combina structured data
  const allStructuredData = [eventStructuredData, breadcrumbStructuredData].filter(Boolean)

  // Atualiza SEO
  useSEO({
    title: eventData.title,
    description,
    image: eventData.image || `${baseUrl}/icon-512.png`,
    url: eventUrl,
    type: 'website',
    keywords: `eventos, ingressos, ${eventData.title}, ${eventData.city || 'Recife'}, Pernambuco, ${eventData.location || ''}`,
    canonical: eventUrl,
    structuredData: allStructuredData.length === 1 ? allStructuredData[0] : allStructuredData,
  })
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
function openWhatsapp(customMessageOrEvent) {
  if (!event.value) return

  openingWhatsapp.value = true

  // Verifica se foi passado uma mensagem customizada (string) ou é evento de click
  let customMessage = typeof customMessageOrEvent === 'string' ? customMessageOrEvent : null

  // Verifica se há tracking de influenciadora
  let phone = event.value.whatsapp
  // Mensagem: customizada > whatsappMessage do evento > mensagem padrão com nome do evento
  let message =
    customMessage ||
    event.value.whatsappMessage ||
    getDefaultWhatsAppMessage(event.value.title, hasInfluencer())

  if (hasInfluencer()) {
    // Usa número fixo e mensagem personalizada para influenciadoras
    phone = getInfluencerPhone()
    // Se não foi passada mensagem customizada, usa mensagem da influencer com nome do evento
    if (!customMessage) {
      message = getWhatsAppMessage(event.value.title) || message
    }
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

// Newsletter subscription
async function subscribeNewsletter() {
  if (!newsletterEmail.value || newsletterLoading.value) return

  // Validação básica de e-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(newsletterEmail.value)) {
    $q.notify({
      type: 'warning',
      message: 'Por favor, insira um e-mail válido.',
      position: 'top',
      timeout: 3000,
      icon: 'warning',
    })
    return
  }

  newsletterLoading.value = true

  try {
    // TODO: Integrar com Supabase ou serviço de newsletter
    // Simulação de delay para feedback visual
    await new Promise((resolve) => setTimeout(resolve, 1000))

    $q.notify({
      type: 'positive',
      message: 'Inscrição realizada com sucesso! Bem-vindo à Newsletter Ticketpe!',
      position: 'top',
      timeout: 4000,
      icon: 'check_circle',
    })

    newsletterEmail.value = ''
  } catch (err) {
    console.error('Erro ao inscrever na newsletter:', err)
    $q.notify({
      type: 'negative',
      message: 'Erro ao realizar inscrição. Tente novamente.',
      position: 'top',
      timeout: 3000,
      icon: 'error',
    })
  } finally {
    newsletterLoading.value = false
  }
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
  width: 100%;
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
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
}

.event-hero {
  width: 100%;
  max-width: 100%;
  /* height: 309px; - Altura controlada pelo aspect ratio */
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

/* Preço à vista destacado quando não há parcelas (eventos com preço baixo) */
.cash-price--no-installments {
  font-family: 'Poppins', sans-serif;
  font-size: 45.18px;
  font-weight: 600; /* Semibold */
  color: white;
  line-height: 1;
  margin-top: 0;
}

/* Texto "No PIX ou no cartão" para eventos sem parcelas */
.payment-info {
  font-family: 'Poppins', sans-serif;
  font-size: 17.57px;
  font-weight: 500;
  color: #45c0e7;
  line-height: 1.2;
  margin-top: 8px;
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

/* Botão de compra específico para múltiplos dias (sem margem negativa) */
.multi-day-buy-btn {
  width: 572px;
  height: 57px;
  border-radius: 10px !important;
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
  background-color: #ffe100 !important;
  color: black !important;
  /* Sem margin-top negativa */
}

.multi-day-buy-btn:hover {
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

  /* Preço destacado no mobile quando não há parcelas */
  .cash-price--no-installments {
    font-family: 'Poppins', sans-serif;
    font-size: 32px;
    font-weight: 600;
    color: white;
    line-height: 1;
    margin-top: 0;
  }

  /* Texto "No PIX ou no cartão" no mobile */
  .payment-info {
    font-size: 14px;
    margin-top: 6px;
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

  .multi-day-buy-btn {
    width: 100%;
    height: 48px;
    border-radius: 8px !important;
    font-size: 16px;
    margin-top: 25 px;
  }

  .buy-btn .q-btn__content,
  .multi-day-buy-btn .q-btn__content {
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

.multi-day-buy-btn:focus-visible {
  outline: 3px solid #35c7ee;
  outline-offset: 3px;
}

/* ==================== TICKETS SECTION (MULTIPLE DAYS) ==================== */
.tickets-section {
  margin-left: -36px;
  margin-right: -36px;
  padding: 32px 36px;
  margin-bottom: 24px;
}

.tickets-carousel-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  padding: 0; /* Remove padding, setas ficam nas bordas */
}

.tickets-scroll-container {
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  width: 100%;
  display: flex;
  justify-content: flex-start; /* Alinha à esquerda */
}

.tickets-scroll-container::-webkit-scrollbar {
  display: none;
}

.ticket-item-column {
  min-width: 280px;
  max-width: 280px;
  flex-shrink: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.991);
  display: flex;
  flex-direction: column;
  padding-left: 24px;
  padding-right: 24px;
}

.ticket-item-column:last-child,
.ticket-item-column.no-border {
  border-right: none;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%) !important;
  z-index: 2;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(42, 52, 71, 0.8); /* Mesma cor do fundo com transparência */
}

.carousel-btn:hover {
  background: rgba(42, 52, 71, 0.8) !important;
  color: white !important;
  transform: translateY(-50%) !important;
}

.carousel-btn :deep(.q-focus-helper) {
  display: none !important;
}

.prev-btn {
  left: -48px;
}

.next-btn {
  right: -48px;
}

.text-magenta {
  color: #d946ef !important;
}

.ticket-installments {
  font-size: 0.85rem;
  font-weight: 400;
  margin-top: 4px;
}

/* Preço destacado quando não há parcelas (eventos com preço baixo) */
.ticket-price--no-installments {
  font-family: 'Poppins', sans-serif;
  font-size: 2.5rem;
  font-weight: 600; /* Semibold */
}

@media (max-width: 599px) {
  .tickets-section {
    margin-left: -20px;
    margin-right: -20px;
    padding: 24px 20px;
  }

  .tickets-carousel-wrapper {
    padding: 0; /* Remove padding das setas no mobile */
  }

  .tickets-scroll-container {
    justify-content: flex-start; /* Alinha à esquerda no mobile */
  }

  .carousel-btn {
    display: none; /* Remove setas no mobile, usa scroll touch */
  }

  .ticket-item-column {
    min-width: 80%; /* Cards ocupam 80% do container, mostrando parte do próximo */
    padding: 0 16px;
  }
}

/* ==================== NEWSLETTER CARD ==================== */
.newsletter-card {
  background: #455066;
  border-radius: 16px;
  padding: 32px 48px;
  margin-top: 48px;
  margin-bottom: 48px;
  max-width: 1120px;
  min-height: 180px;
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
}

.newsletter-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  width: 100%;
}

.newsletter-text {
  flex: 1;
  max-width: 600px;
}

.newsletter-title {
  font-size: 30px;
  font-weight: 600;
  font-family:
    'Poppins',
    system-ui,
    -apple-system,
    'Helvetica Neue',
    Arial,
    sans-serif;
  color: #ffffff;
  line-height: 1.4;
  margin: 0;
}

.newsletter-highlight {
  color: #35c7ee;
}

.newsletter-form {
  flex: 0 0 auto;
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.newsletter-label {
  font-size: 16px;
  font-weight: 400;
  color: #e3e6eb;
  margin-bottom: -4px;
}

.newsletter-input {
  width: 100%;
}

.newsletter-input :deep(.q-field__control) {
  background: #ffffff;
  border-radius: 8px;

  height: 44px;
}

.newsletter-input :deep(.q-field__control-container) {
  padding-top: 0 !important;
}

.newsletter-input :deep(.q-field__native) {
  color: #374151;
  font-size: 14px;
  padding: 10px 14px;
}

.newsletter-input :deep(.q-field__native::placeholder) {
  color: #9ca3af;
}

.newsletter-input :deep(.q-field--outlined .q-field__control:before) {
  border-color: #e5e7eb;
}

.newsletter-btn {
  width: 100%;
  height: 44px;
  border-radius: 8px !important;
  font-size: 14px;
  font-weight: 600;
  background: #35c7ee !important;
  color: #ffffff !important;
  margin-top: 2px;
}

.newsletter-btn:hover {
  background: #2ab0d4 !important;
}

.newsletter-btn:disabled {
  background: #5a6a7a !important;
  color: #9ca3af !important;
  opacity: 0.8;
}

@media (max-width: 1024px) {
  .newsletter-card {
    padding: 28px 32px;
  }

  .newsletter-content {
    gap: 24px;
  }

  .newsletter-title {
    font-size: 18px;
  }

  .newsletter-form {
    width: 280px;
  }
}

@media (max-width: 768px) {
  .newsletter-content {
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
  }

  .newsletter-text,
  .newsletter-form {
    max-width: 100%;
    width: 100%;
  }

  .newsletter-title {
    text-align: center;
  }
}

@media (max-width: 599px) {
  .newsletter-card {
    padding: 20px 16px;
    margin-left: -16px;
    margin-right: -16px;
    margin-top: 24px;
    margin-bottom: 24px;
    border-radius: 12px;
    min-height: auto;
  }

  .newsletter-title {
    font-size: 16px;
    text-align: left;
  }

  .newsletter-form {
    gap: 6px;
    width: 100%;
  }

  .newsletter-label {
    font-size: 12px;
  }

  .newsletter-input :deep(.q-field__control) {
    height: 40px;
  }

  .newsletter-btn {
    height: 40px;
    font-size: 13px;
  }
}

/* ==================== FLOATING BUY BAR ==================== */
.floating-buy-bar {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: calc(100% - 48px);
  max-width: 1120px;
}

.floating-buy-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  background: rgba(42, 52, 71, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 16px 24px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.floating-buy-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.floating-buy-title {
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.floating-buy-price {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.floating-price-value {
  font-family: 'Poppins', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
}

.floating-price-installments {
  font-size: 12px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
}

.floating-buy-btn {
  min-width: 280px;
  height: 52px;
  border-radius: 10px !important;
  font-size: 16px;
  font-weight: 600;
  background-color: #ffe100 !important;
  color: black !important;
  flex-shrink: 0;
}

.floating-buy-btn:hover {
  background-color: #c3ac02 !important;
}

/* Animação de entrada/saída */
.floating-bar-enter-active,
.floating-bar-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.floating-bar-enter-from,
.floating-bar-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@media (max-width: 768px) {
  .floating-buy-bar {
    bottom: 16px;
    width: calc(100% - 32px);
  }

  .floating-buy-content {
    padding: 12px 16px;
    gap: 16px;
  }

  .floating-buy-title {
    font-size: 16px;
  }

  .floating-price-value {
    font-size: 18px;
  }

  .floating-price-installments {
    font-size: 11px;
  }

  .floating-buy-btn {
    min-width: 120px;
    height: 44px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .floating-buy-bar {
    bottom: 12px;
    width: calc(100% - 24px);
  }

  .floating-buy-content {
    padding: 12px 16px;
    gap: 12px;
  }

  .floating-buy-info {
    text-align: left;
  }

  .floating-buy-price {
    align-items: flex-start;
  }

  .floating-buy-btn {
    min-width: 100px;
    height: 40px;
  }
}
</style>
