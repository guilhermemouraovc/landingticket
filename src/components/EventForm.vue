<template>
  <q-form @submit="handleSubmit" class="q-gutter-md">
    <!-- Título e Descrições -->
    <div class="text-h6 text-primary q-mb-md">Informações Básicas</div>

    <q-input
      v-model="formData.title"
      label="Título do Evento *"
      outlined
      :rules="[(val) => !!val || 'Título é obrigatório']"
      hint="Nome do evento"
    />

    <q-input
      v-model="formData.description"
      label="Descrição"
      outlined
      type="textarea"
      rows="4"
      hint="Descrição completa do evento"
    />

    <q-input
      v-model="formData.additional_info"
      label="Informações Adicionais"
      outlined
      type="textarea"
      rows="3"
      hint="Informações extras, atrações, etc."
    />

    <q-separator class="q-my-lg" />

    <!-- Datas -->
    <div class="text-h6 text-primary q-mb-md">Data e Horário</div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-input
          v-model="formData.start_date"
          label="Data de Início"
          outlined
          type="datetime-local"
          hint="Data e hora de início do evento"
        />
      </div>

      <div class="col-12 col-md-6">
        <q-input
          v-model="formData.end_date"
          label="Data de Término"
          outlined
          type="datetime-local"
          hint="Data e hora de término (opcional)"
        />
      </div>
    </div>

    <q-separator class="q-my-lg" />

    <!-- Localização -->
    <div class="text-h6 text-primary q-mb-md">Localização</div>

    <q-input
      v-model="formData.location"
      label="Local"
      outlined
      hint="Nome do local/estabelecimento"
    />

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-input
          v-model="formData.city"
          label="Cidade"
          outlined
          hint="Cidade onde o evento ocorre"
        />
      </div>

      <div class="col-12 col-md-6">
        <q-input v-model="formData.state" label="Estado" outlined hint="Estado (ex: PE, SP, RJ)" />
      </div>
    </div>

    <q-separator class="q-my-lg" />

    <!-- Contato -->
    <div class="text-h6 text-primary q-mb-md">Contato e Compartilhamento</div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-input
          v-model="formData.whatsapp"
          label="WhatsApp"
          outlined
          hint="Número com código do país (ex: +5581998471385)"
        />
      </div>

      <div class="col-12 col-md-6">
        <q-input
          v-model="formData.share_url"
          label="Link de Compartilhamento"
          outlined
          hint="URL para compartilhar o evento"
        />
      </div>
    </div>

    <q-input
      v-model="formData.whatsapp_message"
      label="Mensagem WhatsApp"
      outlined
      hint="Mensagem padrão ao clicar no WhatsApp"
    />

    <q-separator class="q-my-lg" />

    <!-- Preços -->
    <div class="text-h6 text-primary q-mb-md">Informações de Preço</div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-input
          v-model.number="formData.price"
          label="Preço"
          outlined
          type="number"
          step="0.01"
          hint="Preço do ingresso em reais"
          prefix="R$"
        />
      </div>

      <div class="col-12 col-md-4">
        <q-input
          v-model.number="formData.price_installments"
          label="Número de Parcelas"
          outlined
          type="number"
          hint="Quantidade de parcelas"
        />
      </div>

      <div class="col-12 col-md-4">
        <q-input
          v-model.number="formData.installment_value"
          label="Valor da Parcela"
          outlined
          type="number"
          step="0.01"
          hint="Valor de cada parcela"
          prefix="R$"
        />
      </div>
    </div>

    <q-separator class="q-my-lg" />

    <!-- Configurações -->
    <div class="text-h6 text-primary q-mb-md">Configurações</div>

    <q-toggle
      v-model="formData.highlight"
      label="Marcar como Evento em Destaque"
      color="positive"
      class="q-mb-md"
    />

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
      <template v-slot:selected-item="scope">
        <q-chip
          removable
          @remove="scope.removeAtIndex(scope.index)"
          :tabindex="scope.tabindex"
          color="primary"
          text-color="white"
        >
          {{ scope.opt.name }}
        </q-chip>
      </template>
    </q-select>

    <q-separator class="q-my-lg" />

    <!-- Imagens -->
    <div class="text-h6 text-primary q-mb-md">Imagens do Evento</div>

    <div class="q-mb-md">
      <q-btn outline color="primary" icon="add" label="Adicionar Imagem" @click="addImageField" />
    </div>

    <div v-for="(image, index) in formData.images" :key="index" class="q-mb-md">
      <q-card bordered>
        <q-card-section>
          <div class="row q-col-gutter-md items-start">
            <div class="col-12 col-md-6">
              <q-input
                v-model="image.url"
                label="URL da Imagem"
                outlined
                hint="Link completo da imagem"
              />
            </div>

            <div class="col-12 col-md-3">
              <q-select
                v-model="image.image_type"
                :options="imageTypeOptions"
                label="Tipo de Imagem"
                outlined
                hint="Onde usar a imagem"
              />
            </div>

            <div class="col-12 col-md-3">
              <div class="column q-gutter-sm">
                <q-toggle
                  v-model="image.is_primary"
                  label="Imagem Principal"
                  color="positive"
                  @update:model-value="(val) => handlePrimaryToggle(index, val)"
                />
                <q-btn
                  flat
                  dense
                  color="negative"
                  icon="delete"
                  label="Remover"
                  @click="removeImageField(index)"
                />
              </div>
            </div>

            <div class="col-12">
              <q-input
                v-model="image.alt_text"
                label="Texto Alternativo"
                outlined
                hint="Descrição da imagem para acessibilidade"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <q-separator class="q-my-lg" />

    <!-- Botões de Ação -->
    <div class="row q-gutter-md q-mt-lg justify-end">
      <q-btn label="Cancelar" color="grey" @click="$emit('cancel')" :disable="saving" outline />
      <q-btn
        type="submit"
        label="Salvar Evento"
        color="primary"
        icon="save"
        :loading="saving"
        :disable="saving"
      />
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
  whatsapp_message: 'Olá! Tenho interesse no evento.',
  share_url: '',
  price: null,
  price_installments: null,
  installment_value: null,
  currency: 'BRL',
  highlight: false,
  tagIds: [],
  images: [],
})

const tagOptions = ref([])
const imageTypeOptions = [
  { label: 'Card (Carrossel)', value: 'card' },
  { label: 'Detalhes (Página)', value: 'detail' },
  { label: 'Ambos', value: 'both' },
]

onMounted(() => {
  tagOptions.value = props.tags.map((tag) => ({
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
  }))

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
    whatsapp_message: event.whatsapp_message || 'Olá! Tenho interesse no evento.',
    share_url: event.share_url || '',
    price: event.price || null,
    price_installments: event.price_installments || null,
    installment_value: event.installment_value || null,
    currency: event.currency || 'BRL',
    highlight: !!event.highlight,
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
  }
}

function resetForm() {
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
    whatsapp_message: 'Olá! Tenho interesse no evento.',
    share_url: '',
    price: null,
    price_installments: null,
    installment_value: null,
    currency: 'BRL',
    highlight: false,
    tagIds: [],
    images: [],
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

      eventData.images = existingImages
      eventData.newImages = newImages

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
