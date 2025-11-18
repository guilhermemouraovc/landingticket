<template>
  <q-page class="bg-landing">
    <div class="list-wrap">
      <!-- Header com título centralizado -->
      <PageHeader title="Réveillon" />

      <!-- Breadcrumbs -->
      <BreadcrumbNav :crumbs="breadcrumbItems" />

      <!-- Loading skeleton -->
      <div v-if="loading" class="cards-grid">
        <SkeletonLoader variant="list" :count="12" />
      </div>

      <!-- Mensagem de nenhum resultado -->
      <EmptyState
        v-else-if="items.length === 0"
        title="Nenhum evento de Réveillon encontrado"
        message="Não encontramos eventos de Réveillon no momento. Volte mais tarde!"
        icon="celebration"
        button-label="Ver todos os eventos"
        button-to="/programacao"
      />

      <!-- Grid de eventos -->
      <div v-else class="cards-grid" role="list" aria-label="Lista de eventos de Réveillon">
        <EventCard
          v-for="card in items"
          :key="card.id"
          :event="card"
          variant="grid"
          image-height="215px"
          :show-price="true"
          @click="goToEvent(card)"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSupabaseEvents } from 'src/composables/useSupabaseEvents'
import { useCategories } from 'src/composables/useCategories'
import SkeletonLoader from 'src/components/SkeletonLoader.vue'
import BreadcrumbNav from 'src/components/BreadcrumbNav.vue'
import EventCard from 'src/components/EventCard.vue'
import PageHeader from 'src/components/PageHeader.vue'
import EmptyState from 'src/components/EmptyState.vue'

const router = useRouter()
const items = ref([])
const loading = ref(true)

// Composable para gerenciar eventos do Supabase
const { fetchEventsByTag } = useSupabaseEvents()

// Composable para gerenciar categorias (com cache)
const { categories, loadCategories } = useCategories()

// Breadcrumbs
const breadcrumbItems = computed(() => [
  { label: 'Início', to: '/', icon: 'home' },
  { label: 'Réveillon', to: null },
])

onMounted(async () => {
  await loadCategories()
  await loadReveillonEvents()
})

function goToEvent(card) {
  if (card?.link) {
    router.push(card.link)
  }
}

async function loadReveillonEvents() {
  loading.value = true
  try {
    // Busca o nome correto da tag a partir das categorias carregadas
    let tagName = 'Reveillons' // Nome padrão atualizado

    if (categories.value) {
      const reveillonCategory = categories.value.find(
        (c) =>
          c.label === 'Réveillon' ||
          c.label === 'Reveillons' ||
          c.label === 'REVEILLONS' ||
          c.slug === 'reveillon' ||
          c.slug === 'reveillons',
      )
      if (reveillonCategory?.tagName) {
        tagName = reveillonCategory.tagName
      }
    }

    // Tenta diferentes variações para compatibilidade
    let events = await fetchEventsByTag(tagName, { limit: 100 })

    if (!events.length) {
      events = await fetchEventsByTag('Reveillons', { limit: 100 })
    }

    if (!events.length) {
      events = await fetchEventsByTag('REVEILLONS', { limit: 100 })
    }

    if (!events.length) {
      events = await fetchEventsByTag('reveillon', { limit: 100 })
    }

    items.value = events
  } catch (e) {
    if (import.meta.env.DEV) {
      console.error('❌ Falha ao carregar eventos de Réveillon', e)
    }
    items.value = []
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.bg-landing {
  background-color: #2a3447;
  min-height: 100vh;
}

.list-wrap {
  padding: 0 20px 64px;
  max-width: 1440px;
  margin: 0 auto;
}

/* Header agora é componente */

/* Esconder elementos antigos */
.list-header {
  display: none;
}

.list-title {
  display: none;
}

/* EmptyState agora é componente */

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 320px);
  gap: 40px;
  justify-content: center;
}

@media (max-width: 768px) {
  .list-wrap {
    padding: 0 16px 40px;
  }

  .cards-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

.q-btn:focus-visible {
  outline: 2px solid #35c7ee;
  outline-offset: 2px;
}
</style>
