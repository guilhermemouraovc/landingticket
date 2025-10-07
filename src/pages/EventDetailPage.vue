<template>
  <q-page class="event-page">
    <div class="event-container">
      <div class="event-toolbar">
        <q-btn
          flat
          dense
          color="white"
          icon="arrow_back"
          label="Voltar"
          class="toolbar-back"
          @click="goBack"
        />
      </div>

      <q-linear-progress v-if="loading" indeterminate color="warning" class="q-mt-xl" />

      <div v-else-if="error" class="event-error text-center">
        <div class="text-h6 text-white q-mb-sm">{{ error }}</div>
        <q-btn color="warning" text-color="black" label="Voltar para inicio" @click="goHome" />
      </div>

      <div v-else>
        <div class="event-hero-wrap">
          <q-img
            :src="event.image"
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
                @click="shareEvent"
              />
            </div>

            <div class="event-meta">
              <div class="meta-item">
                <div class="meta-badge text-center">
                  <div class="badge-month">{{ event.dateBadge.month }}</div>
                  <div class="badge-day">{{ event.dateBadge.day }}</div>
                </div>

                <div>
                  <div class="meta-title">{{ event.dateLabel }}</div>
                  <div v-if="event.timeLabel" class="meta-subtitle">{{ event.timeLabel }}</div>
                </div>
              </div>

              <div class="meta-item">
                <div class="meta-icon">
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
              unselevated
              no-caps
              @click="openWhatsapp"
            />

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
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from 'boot/axios'

const DEFAULT_IMAGE = 'https://via.placeholder.com/1200x600?text=Evento'
const DEFAULT_WHATSAPP_MESSAGE = 'Ola! Tenho interesse no evento.'

const route = useRoute()
const router = useRouter()

// estado base da tela
const loading = ref(true)
const error = ref('')
const event = ref(null)

// carrega evento inicial e reage a mudancas de rota
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

// fluxo principal de obtencao de dados
async function loadEvent(idParam) {
  loading.value = true
  error.value = ''
  event.value = null

  try {
    const record = await fetchEventRecord(idParam)

    if (!record) {
      error.value = 'Evento nao encontrado.'
      return
    }

    event.value = mapEvent(record)
    console.log('image:', event.value.image)
  } catch (err) {
    console.error('Falha ao carregar evento', err)
    error.value = 'Nao foi possivel carregar os detalhes do evento.'
  } finally {
    loading.value = false
  }
}

// tenta acessar direto e, se falhar, recorre ao filtro por documentId
async function fetchEventRecord(idParam) {
  if (!idParam) return null

  const direct = await tryFetchSingle(idParam)
  if (direct) return direct

  if (/^\d+$/.test(String(idParam))) {
    const numeric = await tryFetchSingle(Number(idParam))
    if (numeric) return numeric
  }

  const response = await api.get('/festas', {
    params: {
      populate: '*',
      'filters[documentId][$eq]': idParam,
      'pagination[pageSize]': 1,
    },
  })

  const items = Array.isArray(response?.data?.data) ? response.data.data : []
  return items[0] ?? null
}

// requisicao defensiva para /festas/:id (string ou numero)
async function tryFetchSingle(idValue) {
  try {
    const response = await api.get(`/festas/${encodeURIComponent(idValue)}`, {
      params: { populate: '*' },
    })
    return response?.data?.data ?? null
  } catch (err) {
    if (err?.response?.status === 404) {
      return null
    }
    throw err
  }
}

// normaliza o payload do Strapi para o template
function mapEvent(payload) {
  const record = payload?.attributes ?? payload ?? {}
  const parsedDate = parseDate(record.Data)
  const dateBadge = buildDateBadge(parsedDate)
  const whatsapp = extractWhatsapp(record)

  return {
    id: String(payload?.id ?? record.documentId ?? dateBadge.code),
    title: record.Nome ?? record.title ?? 'Evento sem nome',
    highlight: record.gatilho ?? record.subtitulo ?? '',
    description:
      record.Descricao ??
      record.descricao ??
      record.description ??
      'Sem descricao disponivel no momento.',
    additionalInfo: record.observacoes ?? record.observacao ?? record.Observacao ?? '',
    image: resolveImage(record),
    dateBadge,
    dateLabel: formatDateLabel(parsedDate),
    timeLabel: formatTimeLabel(parsedDate),
    location:
      record.Local ?? record.local ?? record.Localizacao ?? record.Cidade ?? 'Local a definir',
    cityState: formatCityState(record.Cidade, record.Estado),
    whatsapp,
    whatsappMessage: record.mensagemWhatsapp ?? record.mensagem ?? DEFAULT_WHATSAPP_MESSAGE,
    shareUrl: record.link ?? record.url ?? record.site ?? '',
  }
}

// helpers de formato --------------------------------------------------------
function parseDate(value) {
  const date = value ? new Date(value) : null
  return date && !Number.isNaN(date.getTime()) ? date : null
}

function buildDateBadge(date) {
  if (!date) {
    return { month: '--', day: '--', code: Math.random().toString(36).slice(2) }
  }

  const month = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')
  const day = date.toLocaleDateString('pt-BR', { day: '2-digit' })

  return { month, day, code: (month + '-' + day).toLowerCase() }
}

function formatDateLabel(date) {
  if (!date) return 'Data a definir'
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function formatTimeLabel(date) {
  if (!date) return ''
  const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return `${time} BRT`
}

function formatCityState(city, state) {
  if (!city && !state) return 'Local a definir'
  if (!state) return city
  if (!city) return state
  return city + ' - ' + state
}

// imagem e midias -----------------------------------------------------------
function resolveImage(record) {
  const gallery = Array.isArray(record?.FOTOSEVENTO) ? record.FOTOSEVENTO : []
  const sources = [
    record?.banner,
    record?.capa,
    record?.imagem,
    record?.Imagem,
    record?.imagemUrl,
    record?.cover,
    record?.capaPrincipal,
    ...gallery,
  ]

  for (const source of sources) {
    const url = extractMediaUrl(source)
    if (url) return prependHost(url)
  }

  return DEFAULT_IMAGE
}

function extractMediaUrl(media) {
  if (!media) return null
  if (typeof media === 'string') return media
  if (Array.isArray(media)) {
    for (const item of media) {
      const nested = extractMediaUrl(item)
      if (nested) return nested
    }
    return null
  }

  return (
    media?.url ??
    media?.attributes?.url ??
    media?.data?.attributes?.url ??
    media?.data?.url ??
    media?.formats?.large?.url ??
    media?.formats?.medium?.url ??
    media?.formats?.small?.url ??
    null
  )
}

function prependHost(url) {
  if (!url || typeof url !== 'string') return DEFAULT_IMAGE
  if (url.startsWith('http')) return url
  return 'http://localhost:1337' + url
}

// utilitarios ---------------------------------------------------------------
function extractWhatsapp(record) {
  const candidate =
    record.whatsapp ??
    record.Whatsapp ??
    record.whatsApp ??
    record.contatoWhatsapp ??
    record.whatsappNumber ??
    record.linkWhatsapp ??
    null

  if (!candidate || typeof candidate !== 'string') return null
  const digits = candidate.replace(/\D/g, '')
  return digits.length >= 10 ? digits : null
}

function openWhatsapp() {
  if (!event.value) return

  const phone = event.value.whatsapp
  const message = encodeURIComponent(event.value.whatsappMessage || DEFAULT_WHATSAPP_MESSAGE)
  const base = phone ? 'https://wa.me/' + phone : 'https://wa.me/'
  const url = `${base}?text=${message}`

  if (typeof window !== 'undefined') {
    window.open(url, '_blank')
  }
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
    navigator.share(shareData).catch(() => {})
  } else if (navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(shareUrl).catch(() => {})
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
</style>
