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

    <!-- Lista de Eventos -->
    <q-card>
      <q-card-section>
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
          :rows="filteredEvents"
          :columns="columns"
          row-key="id"
          :loading="loading"
          v-model:pagination="pagination"
          :rows-per-page-options="[10, 20, 50]"
        >
          <template v-slot:body-cell-title="props">
            <q-td :props="props">
              <div class="text-weight-medium">{{ props.value }}</div>
            </q-td>
          </template>

          <template v-slot:body-cell-start_date="props">
            <q-td :props="props">
              {{ props.value ? new Date(props.value).toLocaleDateString('pt-BR') : '-' }}
            </q-td>
          </template>

          <template v-slot:body-cell-highlight="props">
            <q-td :props="props">
              <q-badge
                :color="props.row.highlight ? 'positive' : 'grey'"
                :label="props.row.highlight ? 'Sim' : 'Não'"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-tags="props">
            <q-td :props="props">
              <q-chip
                v-for="tag in props.row.tags"
                :key="tag.id"
                size="sm"
                color="primary"
                text-color="white"
              >
                {{ tag.name }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                dense
                icon="visibility"
                color="info"
                @click="viewEvent(props.row)"
                class="q-mr-xs"
              >
                <q-tooltip>Ver Evento</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                icon="edit"
                color="primary"
                @click="openEventDialog(props.row)"
                class="q-mr-xs"
              >
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                @click="confirmDelete(props.row)"
              >
                <q-tooltip>Deletar</q-tooltip>
              </q-btn>
            </q-td>
          </template>

          <template v-slot:no-data>
            <div class="full-width row flex-center q-gutter-sm q-pa-lg">
              <q-icon size="2em" name="event" />
              <span>Nenhum evento encontrado</span>
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Dialog de Evento -->
    <q-dialog v-model="showEventDialog" maximized persistent>
      <q-card>
        <q-card-section class="row items-center q-pb-none bg-primary text-white">
          <div class="text-h6">
            {{ editingEvent ? 'Editar Evento' : 'Novo Evento' }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pt-md scroll" style="max-height: 80vh">
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
import { generateSlug } from 'src/utils/stringUtils'
import EventForm from 'src/components/EventForm.vue'

const $q = useQuasar()
const { checkAdminPermission, logout } = useAuth()
const { fetchAllEvents, deleteEvent, loading } = useAdminEvents()
const { fetchTags } = useSupabaseTags()

const events = ref([])
const allTags = ref([])
const filter = ref('')
const showEventDialog = ref(false)
const editingEvent = ref(null)

const columns = [
  {
    name: 'title',
    label: 'Título',
    field: 'title',
    align: 'left',
    sortable: true,
  },
  {
    name: 'start_date',
    label: 'Data de Início',
    field: 'start_date',
    align: 'left',
    sortable: true,
  },
  {
    name: 'city',
    label: 'Cidade',
    field: 'city',
    align: 'left',
    sortable: true,
  },
  {
    name: 'highlight',
    label: 'Destaque',
    field: 'highlight',
    align: 'center',
  },
  {
    name: 'tags',
    label: 'Tags',
    field: 'tags',
    align: 'left',
  },
  {
    name: 'actions',
    label: 'Ações',
    field: 'actions',
    align: 'center',
  },
]

const pagination = ref({
  sortBy: 'start_date',
  descending: false,
  page: 1,
  rowsPerPage: 20,
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
  // Debug: Verificar sessão
  const { supabase } = await import('src/utils/supabase')
  const { data: { session } } = await supabase.auth.getSession()
  console.log('🔍 Debug - Sessão:', session)
  console.log('🔍 Debug - User:', session?.user)
  console.log('🔍 Debug - Metadata:', session?.user?.user_metadata)
  console.log('🔍 Debug - is_admin:', session?.user?.user_metadata?.is_admin)
  console.log('🔍 Debug - role:', session?.user?.user_metadata?.role)

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
    console.log('🔄 Iniciando carregamento de eventos...')
    const data = await fetchAllEvents()
    console.log('✅ Dados recebidos do Supabase:', data)
    console.log('📊 Total de eventos:', data?.length || 0)
    
    events.value = data.map(event => ({
      ...event,
      tags: event.event_tags?.map(et => et.tags) || [],
    }))
    
    console.log('✅ Eventos processados:', events.value.length)
    
    if (events.value.length === 0) {
      console.log('ℹ️ Nenhum evento encontrado no banco de dados')
      $q.notify({
        type: 'info',
        message: 'Nenhum evento cadastrado ainda. Clique em "Novo Evento" para criar o primeiro!',
        position: 'top',
        timeout: 4000,
      })
    }
  } catch (err) {
    console.error('❌ Erro ao carregar eventos:', err)
    console.error('❌ Detalhes do erro:', {
      message: err.message,
      details: err.details,
      hint: err.hint,
      code: err.code,
    })
    $q.notify({
      type: 'negative',
      message: `Erro ao carregar eventos: ${err.message || 'Erro desconhecido'}`,
      position: 'top',
      timeout: 5000,
    })
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

function viewEvent(event) {
  const slug = generateSlug(event.title)
  window.open(`/#/event/${slug}`, '_blank')
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
  })
}
</script>

<style scoped>
.q-table th {
  font-weight: 600;
}
</style>
