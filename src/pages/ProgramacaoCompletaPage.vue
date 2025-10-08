<template>
  <q-page class="bg-landing">
    <div class="list-wrap">
      <div class="list-header">
        <q-btn flat round icon="arrow_back" to="/" class="q-mr-md" />
        <div class="list-title">Programação completa</div>
      </div>

      <div class="cards-grid">
        <q-card
          v-for="card in items"
          :key="card.id"
          flat
          bordered
          clickable
          v-ripple
          @click="goToEvent(card)"
          class="event-card"
        >
          <q-img :src="card.image" ratio="16/9" height="180px" />
          <q-card-section>
            <div class="event-title q-mb-xs">{{ card.title }}</div>
            <div class="row items-center event-meta q-mt-xs">
              <q-icon name="event" class="q-mr-sm event-meta__icon" />
              <span>{{ card.date }}</span>
            </div>
            <div class="row items-center event-meta q-mt-xs">
              <q-icon name="place" class="q-mr-sm event-meta__icon" />
              <span>{{ card.location }}</span>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'

const router = useRouter()
const items = ref([])
const DEFAULT_IMAGE = 'https://i.postimg.cc/C59stMzr/Captura-de-tela-2025-10-01-130250.png'

onMounted(loadAll)

function goToEvent(card) {
  if (card?.link) {
    router.push(card.link)
  }
}

async function loadAll() {
  try {
    const { data } = await api.get('/festas', {
      params: {
        'pagination[pageSize]': 120,
        publicationState: 'live',
        'sort[0]': 'Data:asc',
        populate: '*',
      },
    })
    const festas = Array.isArray(data?.data) ? data.data : []
    items.value = festas.map(toCard)
  } catch (e) {
    console.error('Falha ao carregar programação completa', e)
    items.value = []
  }
}

function toCard(festa) {
  const r = festa?.attributes ?? festa ?? {}
  const id = String(festa?.id ?? r.id ?? r.documentId ?? Math.random().toString(36).slice(2))

  // Formatar data
  const dateValue = r.Data || r.data || r.Inicio || r.inicio || r.startDate
  const formattedDate = formatDate(dateValue)

  return {
    id,
    title: r.Nome || r.nome || r.Titulo || r.titulo || r.Title || r.title || 'Evento sem nome',
    date: formattedDate,
    location: [r.Cidade || r.cidade, r.Estado || r.estado || r.UF || r.uf]
      .filter(Boolean)
      .join(' - '),
    image: resolveImage(r) || DEFAULT_IMAGE,
    link: { name: 'event-detail', params: { id: r.documentId ?? id } },
  }
}

function formatDate(value) {
  if (!value) return 'Data a definir'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'Data a definir'
  return parsed.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function resolveImage(r) {
  const gallery = Array.isArray(r?.FOTOSEVENTO) ? r.FOTOSEVENTO : []
  const sources = [
    r?.banner,
    r?.capa,
    r?.imagem,
    r?.Imagem,
    r?.imagemUrl,
    r?.cover,
    r?.capaPrincipal,
    ...gallery,
  ]
  for (const s of sources) {
    const u =
      typeof s === 'string'
        ? s
        : s?.url ||
          s?.attributes?.url ||
          s?.data?.attributes?.url ||
          s?.formats?.medium?.url ||
          s?.formats?.large?.url ||
          s?.formats?.small?.url
    if (u) return u.startsWith('http') ? u : 'http://localhost:1337' + u
  }
  return ''
}
</script>

<style scoped>
.bg-landing {
  background-color: #2a3447;
  min-height: 100vh;
}

.list-wrap {
  padding: 0 80px 64px;
  max-width: 1200px;
  margin: 0 auto;
}

.list-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 0;
}

.list-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 20px;
  color: #fff;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

/* Cards com mesma formatação do carrossel */
.event-card {
  cursor: pointer;
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

.event-card .q-card-section {
  flex: 1;
  padding: 20px 22px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.event-title {
  font-size: 1.05rem;
  line-height: 1.35;
  font-weight: 700;
  color: #1f2937;
}

.event-meta {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  color: #6b7280;
}

.event-meta__icon {
  color: #ec4899;
  font-size: 18px;
}

/* Responsividade */
@media (max-width: 768px) {
  .list-wrap {
    padding: 0 40px 40px;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
