<template>
  <q-form @submit="handleSubmit" class="column">
    <div class="col-auto">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
        mobile-arrows
        outside-arrows
      >
        <q-tab name="geral" icon="info" label="Geral" />
        <q-tab name="data_local" icon="event" label="Data e Local" />
        <q-tab name="precos" icon="payments" label="Valores" />
        <q-tab name="imagens" icon="image" label="Imagens" />
        <q-tab name="dias" icon="calendar_today" label="Múltiplos Dias" />
      </q-tabs>

      <q-separator />
    </div>

    <q-tab-panels v-model="tab" animated class="bg-grey-1">
      <!-- Aba Geral -->
      <q-tab-panel name="geral" class="q-pa-md">
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <q-input
              v-model="formData.title"
              label="Título do Evento *"
              outlined
              :rules="[(val) => !!val || 'Título é obrigatório']"
              hint="Nome principal do evento"
            >
              <template v-slot:prepend>
                <q-icon name="title" />
              </template>
            </q-input>
          </div>

          <div class="col-12">
            <q-select
              v-model="formData.tagIds"
              :options="tagOptions"
              option-value="id"
              option-label="name"
              label="Categorias/Tags"
              outlined
              multiple
              use-chips
              hint="Selecione as categorias do evento"
            >
              <template v-slot:prepend>
                <q-icon name="category" />
              </template>
              <template v-slot:selected-item="scope">
                <q-chip
                  removable
                  @remove="scope.removeAtIndex(scope.index)"
                  :tabindex="scope.tabindex"
                  color="primary"
                  text-color="white"
                  dense
                >
                  {{ scope.opt.name }}
                </q-chip>
              </template>
            </q-select>
          </div>

          <div class="col-12">
            <q-toggle
              v-model="formData.highlight"
              label="Marcar como Evento em Destaque"
              color="warning"
              icon="star"
              class="q-mb-md"
            />
          </div>

          <div class="col-12 col-md-6">
            <q-input
              v-model.number="formData.display_priority"
              label="Prioridade de Exibição"
              outlined
              type="number"
              hint="Eventos com prioridade aparecem primeiro no carrossel (1, 2, 3...). Deixe vazio para ordenar apenas por data."
              :rules="[
                (val) => !val || (val >= 1 && val <= 999) || 'Prioridade deve ser entre 1 e 999',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="sort" />
              </template>
            </q-input>
          </div>

          <div class="col-12">
            <q-input
              v-model="formData.additional_info"
              label="Atrações"
              outlined
              type="textarea"
              rows="6"
              hint="Atrações do evento, artistas, bandas, etc."
            />
          </div>

          <div class="col-12">
            <q-input
              v-model="formData.description"
              label="Descrição Resumida"
              outlined
              type="textarea"
              rows="3"
              hint="Breve descrição para cards e listagens"
            />
          </div>
        </div>
      </q-tab-panel>

      <!-- Aba Data e Local -->
      <q-tab-panel name="data_local">
        <div class="text-subtitle1 text-primary q-mb-md">Agenda</div>
        <div class="row q-col-gutter-md q-mb-lg">
          <div class="col-12 col-md-6">
            <q-input v-model="formData.start_date" label="Início" outlined type="datetime-local">
              <template v-slot:prepend>
                <q-icon name="event_available" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-6">
            <q-input v-model="formData.end_date" label="Término" outlined type="datetime-local">
              <template v-slot:prepend>
                <q-icon name="event_busy" />
              </template>
            </q-input>
          </div>
        </div>

        <q-separator class="q-mb-md" />

        <div class="text-subtitle1 text-primary q-mb-md">Localização</div>
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <q-input
              v-model="formData.location"
              label="Nome do Local"
              outlined
              hint="Ex: Classic Hall, Marco Zero"
            >
              <template v-slot:prepend>
                <q-icon name="place" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-8">
            <q-input v-model="formData.city" label="Cidade" outlined>
              <template v-slot:prepend>
                <q-icon name="location_city" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-4">
            <q-input v-model="formData.state" label="Estado" outlined hint="Ex: PE">
              <template v-slot:prepend>
                <q-icon name="map" />
              </template>
            </q-input>
          </div>
        </div>
      </q-tab-panel>

      <!-- Aba Múltiplos Dias -->
      <q-tab-panel name="dias">
        <div class="row items-center justify-between q-mb-md wrap q-gap-md">
          <div class="text-subtitle1 text-primary">Dias do Evento</div>
          <q-btn
            color="primary"
            icon="add"
            label="Adicionar Dia"
            @click="addDayField"
            unelevated
            :size="$q.screen.lt.sm ? 'sm' : 'md'"
          />
        </div>

        <div v-if="formData.days.length === 0" class="text-center q-pa-lg text-grey">
          <q-icon name="event_busy" size="4em" />
          <div class="q-mt-sm">Nenhum dia adicionado</div>
          <div class="text-caption q-mt-xs">
            Adicione dias específicos para eventos com múltiplas datas
          </div>
        </div>

        <div v-else class="row q-col-gutter-md">
          <div v-for="(day, index) in formData.days" :key="index" class="col-12">
            <q-card bordered flat class="bg-grey-1">
              <q-card-section>
                <div class="row items-center justify-between q-mb-md">
                  <div class="text-h6 text-primary">Dia {{ index + 1 }}</div>
                  <q-btn
                    flat
                    dense
                    color="negative"
                    icon="delete"
                    label="Remover"
                    @click="removeDayField(index)"
                  />
                </div>

                <div class="row q-col-gutter-md">
                  <!-- Data -->
                  <div class="col-12 col-md-4">
                    <q-input
                      v-model="day.date"
                      label="Data *"
                      outlined
                      type="date"
                      :rules="[(val) => !!val || 'Data é obrigatória']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="calendar_today" />
                      </template>
                    </q-input>
                  </div>

                  <!-- Horário de Início -->
                  <div class="col-12 col-md-4">
                    <q-input
                      v-model="day.start_time"
                      label="Horário de Início"
                      outlined
                      type="time"
                    >
                      <template v-slot:prepend>
                        <q-icon name="schedule" />
                      </template>
                    </q-input>
                  </div>

                  <!-- Horário de Término -->
                  <div class="col-12 col-md-4">
                    <q-input v-model="day.end_time" label="Horário de Término" outlined type="time">
                      <template v-slot:prepend>
                        <q-icon name="schedule" />
                      </template>
                    </q-input>
                  </div>

                  <!-- Título do Dia -->
                  <div class="col-12">
                    <q-input
                      v-model="day.title"
                      label="Título do Dia"
                      outlined
                      hint="Ex: Dia 1, Sábado, Abertura"
                    >
                      <template v-slot:prepend>
                        <q-icon name="title" />
                      </template>
                    </q-input>
                  </div>

                  <!-- Descrição -->
                  <div class="col-12">
                    <q-input
                      v-model="day.description"
                      label="Descrição"
                      outlined
                      type="textarea"
                      rows="2"
                      hint="Informações específicas deste dia"
                    />
                  </div>

                  <!-- Preço à Vista -->
                  <div class="col-12 col-md-4">
                    <q-input
                      v-model.number="day.price"
                      label="Preço à Vista"
                      outlined
                      type="number"
                      step="0.01"
                      prefix="R$"
                    >
                      <template v-slot:prepend>
                        <q-icon name="attach_money" />
                      </template>
                    </q-input>
                  </div>

                  <!-- Qtd. Parcelas -->
                  <div class="col-12 col-md-4">
                    <q-input
                      v-model.number="day.price_installments"
                      label="Qtd. Parcelas"
                      outlined
                      type="number"
                    >
                      <template v-slot:prepend>
                        <q-icon name="filter_1" />
                      </template>
                    </q-input>
                  </div>

                  <!-- Valor da Parcela -->
                  <div class="col-12 col-md-4">
                    <q-input
                      v-model.number="day.installment_value"
                      label="Valor da Parcela"
                      outlined
                      type="number"
                      step="0.01"
                      prefix="R$"
                    >
                      <template v-slot:prepend>
                        <q-icon name="money" />
                      </template>
                    </q-input>
                  </div>

                  <!-- Link do Ingresso -->
                  <div class="col-12">
                    <q-input
                      v-model="day.ticket_url"
                      label="Link do Ingresso"
                      outlined
                      hint="URL para compra de ingressos deste dia"
                    >
                      <template v-slot:prepend>
                        <q-icon name="link" />
                      </template>
                    </q-input>
                  </div>

                  <!-- Ativo -->
                  <div class="col-12">
                    <q-toggle
                      v-model="day.is_active"
                      label="Dia ativo (visível no site)"
                      color="positive"
                      :true-value="true"
                      :false-value="false"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-tab-panel>

      <!-- Aba Preços e Contato -->
      <q-tab-panel name="precos">
        <div class="text-subtitle1 text-primary q-mb-md">Valores</div>
        <div class="row q-col-gutter-md q-mb-lg">
          <div class="col-12 col-md-4">
            <q-input
              v-model.number="formData.price"
              label="Preço à Vista"
              outlined
              type="number"
              step="0.01"
              prefix="R$"
            >
              <template v-slot:prepend>
                <q-icon name="attach_money" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model.number="formData.price_installments"
              label="Qtd. Parcelas"
              outlined
              type="number"
            >
              <template v-slot:prepend>
                <q-icon name="filter_1" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model.number="formData.installment_value"
              label="Valor da Parcela"
              outlined
              type="number"
              step="0.01"
              prefix="R$"
            >
              <template v-slot:prepend>
                <q-icon name="money" />
              </template>
            </q-input>
          </div>
        </div>

        <q-separator class="q-mb-md" />

        <div class="text-subtitle1 text-primary q-mb-md">Contato e Redes</div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              v-model="formData.whatsapp"
              label="WhatsApp"
              outlined
              mask="+## (##) #####-####"
              fill-mask
              hint="Ex: +55 (81) 99999-9999"
            >
              <template v-slot:prepend>
                <q-icon name="whatsapp" color="positive" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-6">
            <q-input v-model="formData.share_url" label="Link Externo / Ingressos" outlined>
              <template v-slot:prepend>
                <q-icon name="link" />
              </template>
            </q-input>
          </div>
          <div class="col-12">
            <q-input
              v-model="formData.whatsapp_message"
              label="Mensagem Padrão WhatsApp"
              outlined
              type="textarea"
              rows="2"
            >
              <template v-slot:prepend>
                <q-icon name="chat" />
              </template>
            </q-input>
          </div>
        </div>
      </q-tab-panel>

      <!-- Aba Imagens -->
      <q-tab-panel name="imagens">
        <div class="row items-center justify-between q-mb-md wrap q-gap-md">
          <div class="text-subtitle1 text-primary">Galeria de Imagens</div>
          <q-btn
            color="primary"
            icon="add_photo_alternate"
            label="Adicionar Imagem"
            @click="addImageField"
            unelevated
            :size="$q.screen.lt.sm ? 'sm' : 'md'"
          />
        </div>

        <div v-if="formData.images.length === 0" class="text-center q-pa-lg text-grey">
          <q-icon name="image_not_supported" size="4em" />
          <div class="q-mt-sm">Nenhuma imagem adicionada</div>
        </div>

        <div v-else class="row q-col-gutter-md">
          <div v-for="(image, index) in formData.images" :key="index" class="col-12">
            <q-card bordered flat class="bg-grey-1">
              <q-card-section>
                <div class="row q-col-gutter-sm">
                  <!-- Preview da Imagem (se houver URL válida) -->
                  <div class="col-12 col-sm-3 flex flex-center bg-white q-pa-sm rounded-borders">
                    <q-img
                      v-if="image.url"
                      :src="image.url"
                      style="max-height: 150px; width: 100%"
                      fit="contain"
                      class="rounded-borders"
                    >
                      <template v-slot:error>
                        <div class="absolute-full flex flex-center bg-grey-3 text-grey-7">
                          <q-icon name="broken_image" size="2em" />
                        </div>
                      </template>
                    </q-img>
                    <div v-else class="text-center text-grey-5">
                      <q-icon name="image" size="3em" />
                      <div class="text-caption">Preview</div>
                    </div>
                  </div>

                  <!-- Campos -->
                  <div class="col-12 col-sm-9">
                    <div class="row q-col-gutter-sm">
                      <div class="col-12">
                        <q-input
                          v-model="image.url"
                          label="URL da Imagem"
                          outlined
                          dense
                          bg-color="white"
                        >
                          <template v-slot:prepend>
                            <q-icon name="link" />
                          </template>
                        </q-input>
                      </div>

                      <div class="col-12 col-md-6">
                        <q-input
                          v-model="image.alt_text"
                          label="Texto Alternativo (Alt)"
                          outlined
                          dense
                          bg-color="white"
                        />
                      </div>

                      <div class="col-12 col-md-6">
                        <q-select
                          v-model="image.image_type"
                          :options="imageTypeOptions"
                          label="Onde Exibir?"
                          outlined
                          dense
                          bg-color="white"
                          emit-value
                          map-options
                        />
                      </div>

                      <div class="col-12 row items-center justify-between q-mt-xs wrap">
                        <q-toggle
                          v-model="image.is_primary"
                          label="Capa Principal"
                          color="positive"
                          dense
                          @update:model-value="(val) => handlePrimaryToggle(index, val)"
                        />
                        <q-btn
                          flat
                          dense
                          color="negative"
                          icon="delete"
                          label="Remover"
                          class="q-px-sm"
                          @click="removeImageField(index)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>

    <!-- Botões de Ação Fixos -->
    <div class="col-auto bg-white">
      <q-separator />
      <div class="row q-gutter-md q-pa-md justify-end wrap">
        <q-btn
          label="Cancelar"
          flat
          color="grey-8"
          @click="$emit('cancel')"
          :disable="saving"
          class="q-px-md"
          :class="{ 'full-width': $q.screen.lt.sm }"
        />
        <q-btn
          type="submit"
          label="Salvar Evento"
          color="primary"
          icon="save"
          unelevated
          :loading="saving"
          :disable="saving"
          class="q-px-md"
          :class="{ 'full-width': $q.screen.lt.sm }"
        />
      </div>
    </div>
  </q-form>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useAdminEvents } from 'src/composables/useAdminEvents'

const props = defineProps({
  event: {
    type: Object,
    default: null,
  },
  tags: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['save', 'cancel'])

const { createEvent, updateEvent, loading: saving } = useAdminEvents()

const tab = ref('geral')

const formData = ref({
  title: '',
  description: '',
  additional_info: '',
  start_date: '',
  end_date: '',
  location: '',
  city: '',
  state: '',
  whatsapp: '+5581998471385',
  whatsapp_message: '',
  share_url: '',
  price: null,
  price_installments: null,
  installment_value: null,
  currency: 'BRL',
  highlight: false,
  display_priority: null,
  tagIds: [],
  images: [],
  days: [],
})

const tagOptions = ref([])
const imageTypeOptions = [
  { label: 'Card (Carrossel)', value: 'card' },
  { label: 'Detalhes (Página)', value: 'detail' },
  { label: 'Ambos', value: 'both' },
]

function updateTagOptions() {
  tagOptions.value = props.tags.map((tag) => ({
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
  }))

  // Se as tags carregarem depois do evento, precisamos remapear a seleção
  if (props.event) {
    const selectedTags =
      props.event.event_tags
        ?.map((et) => tagOptions.value.find((t) => t.id === et.tag_id))
        .filter(Boolean) || []

    // Atualiza apenas se tivermos tags correspondentes
    if (selectedTags.length > 0) {
      formData.value.tagIds = selectedTags
    }
  }
}

// Monitora mudanças nas tags (carregamento assíncrono)
watch(
  () => props.tags,
  () => {
    updateTagOptions()
  },
  { immediate: true },
)

onMounted(() => {
  // tagOptions é populado pelo watcher

  if (props.event) {
    loadEventData()
  }
})

watch(
  () => props.event,
  () => {
    if (props.event) {
      loadEventData()
    } else {
      resetForm()
    }
  },
)

function loadEventData() {
  const event = props.event
  tab.value = 'geral' // Reseta para a primeira aba ao carregar

  // Mapeia as tags selecionadas
  const selectedTags =
    event.event_tags
      ?.map((et) => tagOptions.value.find((t) => t.id === et.tag_id))
      .filter(Boolean) || []

  formData.value = {
    title: event.title || '',
    description: event.description || '',
    additional_info: event.additional_info || '',
    start_date: event.start_date ? formatDateTimeLocal(event.start_date) : '',
    end_date: event.end_date ? formatDateTimeLocal(event.end_date) : '',
    location: event.location || '',
    city: event.city || '',
    state: event.state || '',
    whatsapp: event.whatsapp || '+5581998471385',
    whatsapp_message: event.whatsapp_message || '',
    share_url: event.share_url || '',
    price: event.price || null,
    price_installments: event.price_installments || null,
    installment_value: event.installment_value || null,
    currency: event.currency || 'BRL',
    highlight: !!event.highlight,
    display_priority: event.display_priority || null,
    tagIds: selectedTags,
    images:
      event.event_images?.map((img) => ({
        id: img.id,
        url: img.url,
        alt_text: img.alt_text,
        is_primary: img.is_primary,
        order_index: img.order_index,
        image_type: img.image_type || 'both',
      })) || [],
    days:
      event.event_days?.map((day) => ({
        id: day.id,
        date: day.date || '',
        start_time: day.start_time || '',
        end_time: day.end_time || '',
        title: day.title || '',
        description: day.description || '',
        price: day.price || null,
        price_installments: day.price_installments || null,
        installment_value: day.installment_value || null,
        ticket_url: day.ticket_url || '',
        is_active: day.is_active !== undefined ? day.is_active : true,
      })) || [],
  }
}

function resetForm() {
  tab.value = 'geral'
  formData.value = {
    title: '',
    description: '',
    additional_info: '',
    start_date: '',
    end_date: '',
    location: '',
    city: '',
    state: '',
    whatsapp: '+5581998471385',
    whatsapp_message: '',
    share_url: '',
    price: null,
    price_installments: null,
    installment_value: null,
    currency: 'BRL',
    highlight: false,
    display_priority: null,
    tagIds: [],
    images: [],
    days: [],
  }
}

function formatDateTimeLocal(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

function addImageField() {
  formData.value.images.push({
    url: '',
    alt_text: '',
    is_primary: formData.value.images.length === 0,
    order_index: formData.value.images.length,
    image_type: 'both',
  })
}

function removeImageField(index) {
  formData.value.images.splice(index, 1)
  // Reordena os índices
  formData.value.images.forEach((img, idx) => {
    img.order_index = idx
  })
}

function handlePrimaryToggle(index, value) {
  if (value) {
    // Desmarca todas as outras imagens como primárias
    formData.value.images.forEach((img, idx) => {
      if (idx !== index) {
        img.is_primary = false
      }
    })
  }
}

function addDayField() {
  formData.value.days.push({
    date: '',
    start_time: '',
    end_time: '',
    title: '',
    description: '',
    price: null,
    price_installments: null,
    installment_value: null,
    ticket_url: '',
    is_active: true,
  })
}

function removeDayField(index) {
  formData.value.days.splice(index, 1)
}

async function handleSubmit() {
  try {
    const eventData = {
      ...formData.value,
      start_date: formData.value.start_date
        ? new Date(formData.value.start_date).toISOString()
        : null,
      end_date: formData.value.end_date ? new Date(formData.value.end_date).toISOString() : null,
      highlight: formData.value.highlight ? 'sim' : null,
      tagIds: formData.value.tagIds.map((tag) => tag.id),
    }

    // Separa imagens novas das existentes
    if (props.event) {
      const existingImages = eventData.images.filter((img) => img.id)
      const newImages = eventData.images.filter((img) => !img.id)
      // Identifica imagens removidas (estavam no original mas não estão no form)
      const originalImageIds = props.event.event_images?.map((img) => img.id) || []
      const currentImageIds = existingImages.map((img) => img.id)
      const removeImageIds = originalImageIds.filter((id) => !currentImageIds.includes(id))

      eventData.images = existingImages // Imagens para atualizar (se necessário, a lógica de update pode precisar ser refinada no backend se houver update de campos de imagem existente)
      eventData.newImages = newImages
      eventData.removeImageIds = removeImageIds

      // Separa dias novos dos existentes
      const existingDays = eventData.days.filter((day) => day.id)
      const newDays = eventData.days.filter((day) => !day.id)
      // Identifica dias removidos (estavam no original mas não estão no form)
      const originalDayIds = props.event.event_days?.map((day) => day.id) || []
      const currentDayIds = existingDays.map((day) => day.id)
      const removeDayIds = originalDayIds.filter((id) => !currentDayIds.includes(id))

      eventData.days = existingDays
      eventData.newDays = newDays
      eventData.removeDayIds = removeDayIds

      await updateEvent(props.event.id, eventData)
    } else {
      await createEvent(eventData)
    }

    emit('save', eventData)
  } catch (err) {
    console.error('Erro ao salvar evento:', err)
  }
}
</script>

<style scoped>
/* Estilização via classes utilitárias */
</style>
