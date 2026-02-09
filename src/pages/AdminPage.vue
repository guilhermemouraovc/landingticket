<template>
  <div class="admin-page">
    <!-- Header fixo com logo e título -->
    <header class="admin-header">
      <div class="admin-header__inner">
        <div class="admin-header__brand">
          <router-link to="/" class="admin-logo-link">
            <img
              src="/logo.svg"
              alt="Ticketpe"
              class="admin-logo"
            />
          </router-link>
          <div class="admin-header__title-group">
            <h1 class="admin-header__title">Admin Page Ticketpe</h1>
            <span class="admin-header__subtitle">Gerencie todos os eventos da plataforma</span>
          </div>
        </div>

        <div class="admin-header__actions">
          <q-btn
            flat
            no-caps
            color="white"
            icon="bar_chart"
            label="Métricas"
            class="admin-btn admin-btn--ghost"
            :to="{ name: 'admin-metrics' }"
          />
          <q-btn
            flat
            no-caps
            color="white"
            icon="home"
            label="Voltar ao Site"
            class="admin-btn admin-btn--ghost"
            @click="$router.push('/')"
          />
          <q-btn
            unelevated
            no-caps
            color="cyan"
            text-color="dark"
            icon="add"
            label="Novo Evento"
            class="admin-btn admin-btn--primary"
            @click="openEventDialog(null)"
            :disable="loading"
          />
          <q-btn
            flat
            no-caps
            color="negative"
            icon="logout"
            label="Sair"
            class="admin-btn admin-btn--danger"
            @click="handleLogout"
          />
        </div>
      </div>
    </header>

    <!-- Conteúdo principal -->
    <main class="admin-content">
      <!-- Lista de Eventos (Grid) -->
      <div class="row items-center q-mb-md">
        <q-input
          v-model="filter"
          placeholder="Buscar eventos..."
          outlined
          dense
          dark
          class="col-12 col-md-4 admin-search"
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
        dark
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
              :clickable="false"
            >
              <template #footer>
                <div class="admin-card-actions">
                  <q-btn
                    flat
                    dense
                    no-caps
                    icon="edit"
                    label="Editar"
                    color="cyan"
                    @click="openEventDialog(props.row)"
                  />
                  <q-btn
                    flat
                    dense
                    no-caps
                    icon="delete"
                    label="Deletar"
                    color="negative"
                    @click="confirmDelete(props.row)"
                  />
                  <q-toggle
                    :model-value="props.row.active !== false"
                    label="Ativo"
                    color="cyan"
                    dark
                    dense
                    @update:model-value="val => handlePatch({ id: props.row.id, active: val })"
                  />
                </div>
              </template>
            </EventCard>
          </div>
        </template>

        <template v-slot:no-data>
          <div class="full-width row flex-center q-gutter-sm q-pa-lg text-grey-5">
            <q-icon size="2em" name="event_busy" />
            <span>Nenhum evento encontrado</span>
          </div>
        </template>
      </q-table>

      <!-- Dialog de Evento -->
      <q-dialog v-model="showEventDialog" :maximized="$q.screen.lt.md" persistent>
        <q-card class="column full-height" :style="$q.screen.lt.md ? '' : 'min-width: 70vw; max-width: 90vw;'">
          <q-card-section class="row items-center q-pb-none bg-primary text-white">
            <div class="text-h6">
              {{ editingEvent ? 'Editar Evento' : 'Novo Evento' }}
            </div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-separator />

          <q-card-section class="col q-pa-none scroll">
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
    </main>
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
.admin-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
}

/* ========== HEADER ========== */
.admin-header {
  background: linear-gradient(90deg, #161f2f 0%, #1a2742 100%);
  border-bottom: 1px solid rgba(53, 199, 238, 0.2);
  padding: 16px 24px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.admin-header__inner {
  max-width: 1800px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.admin-header__brand {
  display: flex;
  align-items: center;
  gap: 20px;
}

.admin-logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.admin-logo-link:hover {
  opacity: 0.85;
}

.admin-logo {
  width: 160px;
  height: auto;
}

.admin-header__title-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-left: 2px solid #35c7ee;
  padding-left: 20px;
}

.admin-header__title {
  font-family: 'Poppins', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  line-height: 1.2;
  background: linear-gradient(90deg, #fff 0%, #35c7ee 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.admin-header__subtitle {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
}

.admin-header__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-btn {
  font-weight: 500;
  letter-spacing: 0.3px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.admin-btn--ghost {
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.admin-btn--ghost:hover {
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.05);
}

.admin-btn--primary {
  box-shadow: 0 4px 14px rgba(53, 199, 238, 0.3);
}

.admin-btn--primary:hover {
  box-shadow: 0 6px 20px rgba(53, 199, 238, 0.4);
  transform: translateY(-1px);
}

.admin-btn--danger:hover {
  background: rgba(239, 68, 68, 0.1);
}

/* ========== CONTENT ========== */
.admin-content {
  padding: 24px;
  max-width: 1800px;
  margin: 0 auto;
}

.admin-search :deep(.q-field__control) {
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.admin-search :deep(.q-field__control:hover) {
  border-color: rgba(53, 199, 238, 0.3);
}

.admin-search :deep(.q-field--focused .q-field__control) {
  border-color: #35c7ee;
  box-shadow: 0 0 0 2px rgba(53, 199, 238, 0.2);
}

/* ========== ADMIN CARD ACTIONS ========== */
.admin-card-actions {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

/* ========== RESPONSIVO ========== */
@media (max-width: 1024px) {
  .admin-header__inner {
    flex-wrap: wrap;
    gap: 16px;
  }

  .admin-header__actions {
    flex-wrap: wrap;
    gap: 8px;
  }
}

@media (max-width: 768px) {
  .admin-header {
    padding: 12px 16px;
  }

  .admin-header__brand {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .admin-header__title-group {
    border-left: none;
    padding-left: 0;
    border-top: 2px solid #35c7ee;
    padding-top: 12px;
  }

  .admin-logo {
    width: 140px;
  }

  .admin-header__title {
    font-size: 1.25rem;
  }

  .admin-header__actions {
    width: 100%;
    justify-content: flex-start;
  }

  .admin-btn :deep(.q-btn__content) {
    font-size: 0.8rem;
  }

  .admin-content {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .admin-header__actions {
    flex-direction: column;
    width: 100%;
  }

  .admin-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
