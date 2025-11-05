<template>
  <div class="category-filter">
    <div class="filter-header">
      <q-icon name="category" size="20px" class="filter-header__icon" />
      <span class="filter-header__title">Categorias</span>
    </div>

    <div class="category-chips" role="group" aria-label="Seleção de categorias">
      <q-chip
        v-for="category in categories"
        :key="category.id"
        clickable
        flat
        :color="selectedCategories.includes(category.id) ? category.color : undefined"
        :text-color="
          selectedCategories.includes(category.id)
            ? {}
            : { backgroundColor: '#e5e7eb', color: '#374151' }
        "
        class="category-chip"
        :aria-label="`${category.name}. ${selectedCategories.includes(category.id) ? 'Selecionado' : 'Não selecionado'}`"
        :aria-pressed="selectedCategories.includes(category.id)"
        role="button"
        tabindex="0"
        @click="toggleCategory(category.id)"
        @keydown.enter="toggleCategory(category.id)"
        @keydown.space.prevent="toggleCategory(category.id)"
      >
        <template #default>
          <span class="category-chip-content">
            <CategoryIcon
              :icon="category.icon"
              :size="16"
              color="currentColor"
              icon-class="category-chip-icon"
            />
            <span class="category-chip-label">{{ category.name }}</span>
          </span>
        </template>
      </q-chip>
    </div>

    <!-- Botão para limpar seleção -->
    <div v-if="selectedCategories.length > 0" class="filter-actions">
      <q-btn
        flat
        dense
        no-caps
        label="Limpar categorias"
        icon="close"
        color="grey-7"
        size="sm"
        aria-label="Limpar todas as categorias selecionadas"
        @click="clearCategories"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import CategoryIcon from 'components/CategoryIcon.vue'
import { useSupabaseTags } from 'src/composables/useSupabaseTags'

// Composable para carregar tags dinâmicas
const { mapToCategoryChips } = useSupabaseTags()
const rawCategories = ref([])

// Carrega categorias ao montar o componente
onMounted(async () => {
  try {
    // Como CategoryFilter usa chips, precisamos buscar do Supabase diretamente
    const { fetchTags } = useSupabaseTags()
    const tags = await fetchTags()
    rawCategories.value = mapToCategoryChips(tags)
    console.log('✅ Tags carregadas no filtro:', rawCategories.value.length)
  } catch (e) {
    console.error('❌ Erro ao carregar tags no filtro:', e)
    rawCategories.value = []
  }
})

// Props
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
})

// Emits
const emit = defineEmits(['update:modelValue'])

// Computed
const categories = computed(() => rawCategories.value)

const selectedCategories = computed(() => props.modelValue)

// Methods
function toggleCategory(categoryId) {
  const current = [...selectedCategories.value]
  const index = current.indexOf(categoryId)

  if (index > -1) {
    // Remove se já estiver selecionado
    current.splice(index, 1)
  } else {
    // Adiciona se não estiver selecionado
    current.push(categoryId)
  }

  emit('update:modelValue', current)
}

function clearCategories() {
  emit('update:modelValue', [])
}
</script>

<style scoped>
.category-filter {
  padding: 16px 0;
}

.filter-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  padding: 0 4px;
}

.filter-header__icon {
  color: #35c7ee;
}

.filter-header__title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.category-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-start;
  align-items: flex-start;
}

.category-chip-content {
  display: flex;
  align-items: center;
  gap: 6px;
}

.category-chip-icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
}

.category-chip :deep(.phosphor-icon svg) {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

.category-chip {
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  outline: none !important;
  border: none !important;
  border-color: transparent !important;
  box-shadow: none !important;
  position: relative;
}

/* Borda branca grossa usando pseudo-elemento para mascarar stroke cinza */
.category-chip :deep(.q-chip--colored) {
  border: none !important;
  position: relative;
}

.category-chip :deep(.q-chip--colored::before) {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  background: white;
  border-radius: inherit;
  z-index: -1;
  pointer-events: none;
}

.category-chip :deep(.q-chip) {
  border: none !important;
  border-color: transparent !important;
  box-shadow: none !important;
  outline: none !important;
}

.category-chip :deep(.q-chip__content) {
  border: none !important;
  border-color: transparent !important;
}

.category-chip :deep(.q-chip__content::before),
.category-chip :deep(.q-chip__content::after) {
  display: none !important;
  border: none !important;
}

.category-chip:not(.q-chip--colored) {
  border: none !important;
  border-color: transparent !important;
}

/* Remove qualquer borda do Quasar aplicada por cores */
.category-chip :deep(.q-chip--selected),
.category-chip :deep(.q-chip--clickable) {
  border: none !important;
  border-color: transparent !important;
  box-shadow: none !important;
}

/* Remove stroke de elementos SVG internos se houver */
.category-chip :deep(svg),
.category-chip :deep(path) {
  stroke: none !important;
}

.category-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.filter-actions {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

/* ==================== ACESSIBILIDADE - FOCUS STATES ==================== */
.category-chip:focus-visible {
  outline: 2px solid #35c7ee;
  outline-offset: 2px;
}

.q-btn:focus-visible {
  outline: 2px solid #35c7ee;
  outline-offset: 2px;
}
</style>
