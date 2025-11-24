<template>
  <div class="q-pa-md" style="min-height: 100vh">
    <!-- Header com botão de logout -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4">Gerenciamento de Eventos</div>
        <div class="text-subtitle2 text-grey-7">
          Gerencie todos os eventos da plataforma
        </div>
      </div>
      <div class="row q-gutter-sm">
        <q-btn
          outline
          color="grey"
          icon="home"
          label="Voltar ao Site"
          @click="$router.push('/')"
        />
        <q-btn
          color="primary"
          icon="add"
          label="Novo Evento"
          @click="openEventDialog(null)"
          :disable="loading"
        />
        <q-btn
          outline
          color="negative"
          icon="logout"
          label="Sair"
          @click="handleLogout"
        />
      </div>
    </div>

    <!-- Lista de Eventos (Grid) -->
    <div class="row items-center q-mb-md">
      <q-input
        v-model="filter"
        placeholder="Buscar eventos..."
        outlined
        dense
        class="col-12 col-md-4"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
        <template v-slot:append v-if="filter">
          <q-icon
            name="close"
            class="cursor-pointer"
            @click="filter = ''"
          />
        </template>
      </q-input>
    </div>

    <q-table
      grid
      :rows="filteredEvents"
      :columns="columns"
      row-key="id"
      :loading="loading"
      v-model:pagination="pagination"
      :rows-per-page-options="[12, 24, 48]"
      hide-header
      card-container-class="q-col-gutter-md"
    >
      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <EventCard
            :event="props.row.cardDisplay"
            variant="grid"
            admin-mode
            :clickable="false"
            @patch="handlePatch"
            @edit="() => openEventDialog(props.row)"
            @delete="() => confirmDelete(props.row)"
          />
        </div>
      </template>

      <template v-slot:no-data>
        <div class="full-width row flex-center q-gutter-sm q-pa-lg text-grey-7">
          <q-icon size="2em" name="event_busy" />
          <span>Nenhum evento encontrado</span>
        </div>
      </template>
    </q-table>

    <!-- Dialog de Evento -->
    <q-dialog v-model="showEventDialog" maximized persistent>
      <q-card class="column full-height">
        <q-card-section class="row items-center q-pb-none bg-primary text-white">
          <div class="text-h6">
            {{ editingEvent ? 'Editar Evento' : 'Novo Evento' }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section class="col q-pa-none">
          <EventForm
            v-if="showEventDialog"
            :event="editingEvent"
            :tags="allTags"
            @save="handleSave"
            @cancel="showEventDialog = false"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useAuth } from 'src/composables/useAuth'
import { useAdminEvents } from 'src/composables/useAdminEvents'
import { useSupabaseTags } from 'src/composables/useSupabaseTags'
import { toEventCardFromSb } from 'src/utils/supabaseEventMapper'
import EventForm from 'src/components/EventForm.vue'
import EventCard from 'src/components/EventCard.vue'

const $q = useQuasar()
const { checkAdminPermission, logout } = useAuth()
const { fetchAllEvents, deleteEvent, patchEvent, loading } = useAdminEvents()
const { fetchTags } = useSupabaseTags()

const events = ref([])
const allTags = ref([])
const filter = ref('')
const showEventDialog = ref(false)
const editingEvent = ref(null)

// Colunas são usadas apenas para filtragem interna do q-table, mesmo no modo grid
const columns = [
  { name: 'title', field: 'title' },
  { name: 'city', field: 'city' },
  { name: 'description', field: 'description' },
  { name: 'location', field: 'location' }
]

const pagination = ref({
  sortBy: 'created_at',
  descending: true,
  page: 1,
  rowsPerPage: 12,
})

// Filtra eventos baseado no filtro de busca
const filteredEvents = computed(() => {
  if (!filter.value) return events.value
  
  const searchTerm = filter.value.toLowerCase()
  return events.value.filter(event => {
    return (
      event.title?.toLowerCase().includes(searchTerm) ||
      event.city?.toLowerCase().includes(searchTerm) ||
      event.location?.toLowerCase().includes(searchTerm) ||
      event.description?.toLowerCase().includes(searchTerm)
    )
  })
})

onMounted(async () => {
  // Verifica permissão
  const hasPermission = await checkAdminPermission()
  if (!hasPermission) {
    return
  }

  await loadEvents()
  await loadTags()
})

async function loadEvents() {
  try {
    const data = await fetchAllEvents()
    
    events.value = data.map(event => {
      // Prepara dados para o EventCard
      const cardDisplay = toEventCardFromSb({
        ...event,
        images: event.event_images,
        tags: event.event_tags?.map(et => et.tags)
      })

      // Mantém o objeto original para o EventForm e anexa o cardDisplay
      return {
        ...event,
        tags: event.event_tags?.map(et => et.tags) || [],
        cardDisplay
      }
    })
    
    if (events.value.length === 0) {
      $q.notify({
        type: 'info',
        message: 'Nenhum evento cadastrado ainda. Clique em "Novo Evento" para criar o primeiro!',
        position: 'top',
        timeout: 4000,
      })
    }
  } catch (err) {
    console.error('Erro ao carregar eventos:', err)
  }
}

async function loadTags() {
  try {
    allTags.value = await fetchTags()
  } catch (err) {
    console.error('Erro ao carregar tags:', err)
  }
}

function openEventDialog(event) {
  editingEvent.value = event ? { ...event } : null
  showEventDialog.value = true
}

async function handleSave() {
  try {
    await loadEvents()
    showEventDialog.value = false
    editingEvent.value = null
  } catch (err) {
    console.error('Erro ao salvar evento:', err)
  }
}

async function handlePatch({ id, ...fields }) {
  try {
    // Otimista: Atualiza localmente primeiro
    const eventIndex = events.value.findIndex(e => e.id === id)
    if (eventIndex !== -1) {
      const updatedEvent = { ...events.value[eventIndex], ...fields }
      
      // Atualiza o cardDisplay também
      updatedEvent.cardDisplay = toEventCardFromSb({
        ...updatedEvent,
        images: updatedEvent.event_images,
        tags: updatedEvent.tags
      })
      
      events.value[eventIndex] = updatedEvent
    }

    // Envia para o servidor
    await patchEvent(id, fields)
    
    // Recarrega para garantir consistência (opcional, mas seguro)
    // await loadEvents() 
  } catch (err) {
    // Reverte em caso de erro (poderia implementar revert aqui)
    console.error('Erro ao atualizar evento:', err)
    await loadEvents() // Recarrega para desfazer o otimismo
  }
}

function confirmDelete(event) {
  $q.dialog({
    title: 'Confirmar Exclusão',
    message: `Tem certeza que deseja deletar o evento "${event.title}"? Esta ação não pode ser desfeita.`,
    cancel: {
      label: 'Cancelar',
      color: 'grey',
      flat: true,
    },
    ok: {
      label: 'Deletar',
      color: 'negative',
    },
    persistent: true,
  }).onOk(async () => {
    try {
      await deleteEvent(event.id)
      await loadEvents()
    } catch (err) {
      console.error('Erro ao deletar evento:', err)
    }
  })
}

async function handleLogout() {
  $q.dialog({
    title: 'Confirmar Logout',
    message: 'Deseja realmente sair da área administrativa?',
    cancel: {
      label: 'Cancelar',
      flat: true,
    },
    ok: {
      label: 'Sair',
      color: 'negative',
    },
  }).onOk(async () => {
    await logout()
    // Redireciona para login ou home após logout
    window.location.reload()
  })
}
</script>

<style scoped>
/* Estilização adicional se necessário */
</style>
