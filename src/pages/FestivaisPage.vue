<template>
  <q-page class="bg-landing">
    <div class="list-wrap">
      <!-- Header com título centralizado -->
      <PageHeader title="Festivais" />

      <!-- Breadcrumbs -->
      <BreadcrumbNav :crumbs="breadcrumbItems" />

      <!-- Loading skeleton -->
      <div v-if="loading" class="cards-grid">
        <SkeletonLoader variant="list" :count="12" />
      </div>

      <!-- Mensagem de nenhum resultado -->
      <EmptyState
        v-else-if="items.length === 0"
        title="Nenhum evento de Festivais encontrado"
        message="Não encontramos eventos de Festivais no momento. Volte mais tarde!"
        icon="celebration"
        button-label="Ver todos os eventos"
        button-to="/programacao"
      />

      <!-- Grid de eventos -->
      <div v-else class="cards-grid" role="list" aria-label="Lista de eventos de Festivais">
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

// Composable para gerenciar eventos
const { fetchEventsByTag: fetchEventsByTagSupabase } = useSupabaseEvents()

// Composable para gerenciar categorias (com cache)
const { categories, loadCategories } = useCategories()

// Breadcrumbs
const breadcrumbItems = computed(() => [
  { label: 'Início', to: '/', icon: 'home' },
  { label: 'Festivais', to: null },
])

onMounted(async () => {
  await loadCategories()
  await loadFestivaisEvents()
})

function goToEvent(card) {
  if (card?.link) {
    router.push(card.link)
  }
}

async function loadFestivaisEvents() {
  loading.value = true
  try {
    // Busca o nome correto da tag a partir das categorias carregadas
    let tagName = 'Festivais' // Nome padrão atualizado

    if (categories.value) {
      const festivaisCategory = categories.value.find(
        (c) => c.label === 'Festivais' || c.label === 'FESTIVAIS' || c.slug === 'festivais',
      )
      if (festivaisCategory?.tagName) {
        tagName = festivaisCategory.tagName
      }
    }

    // Tenta diferentes variações para compatibilidade
    let events = await fetchEventsByTagSupabase(tagName, { limit: 100 })

    if (!events.length) {
      events = await fetchEventsByTagSupabase('Festivais', { limit: 100 })
    }

    if (!events.length) {
      events = await fetchEventsByTagSupabase('FESTIVAIS', { limit: 100 })
    }

    items.value = events
  } catch (e) {
    if (import.meta.env.DEV) {
      console.error('❌ Falha ao carregar eventos de Festivais', e)
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
