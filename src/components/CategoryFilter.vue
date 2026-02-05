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
        :color="selectedCategories.includes(category.id) ? category.color : 'grey-3'"
        :text-color="selectedCategories.includes(category.id) ? 'white' : 'grey-8'"
        class="category-chip"
        :class="{ 'category-chip--selected': selectedCategories.includes(category.id) }"
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
/* ==================== BRUTAL CATEGORY FILTER ==================== */
.category-filter {
  padding: 20px 0;
}

.filter-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 0 4px;
}

.filter-header__icon {
  color: #FFE500;
  font-size: 22px;
}

.filter-header__title {
  font-family: 'Poppins', sans-serif;
  font-size: 1.1rem;
  font-weight: 800;
  color: #1a1a1a;
  text-transform: uppercase;
  letter-spacing: -0.3px;
}

.category-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: flex-start;
  align-items: flex-start;
}

.category-chip-content {
  display: flex;
  align-items: center;
  gap: 8px;
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
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 0.8rem;
  transition: all 0.15s ease;
  outline: none !important;
  border: 3px solid #1a1a1a !important;
  border-radius: 0 !important;
  box-shadow: 3px 3px 0px #1a1a1a;
  position: relative;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.category-chip :deep(.q-chip) {
  border-radius: 0 !important;
}

.category-chip :deep(.q-chip--colored) {
  border: none !important;
  position: relative;
  border-radius: 0 !important;
}

.category-chip :deep(.q-chip--colored::before) {
  display: none !important;
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
  border: 3px solid #1a1a1a !important;
}

.category-chip :deep(.q-chip--selected),
.category-chip :deep(.q-chip--clickable) {
  border: none !important;
  border-color: transparent !important;
  box-shadow: none !important;
  border-radius: 0 !important;
}

.category-chip :deep(svg),
.category-chip :deep(path) {
  stroke: none !important;
}

.category-chip:hover {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0px #1a1a1a;
}

.category-chip:active {
  transform: translate(1px, 1px);
  box-shadow: 2px 2px 0px #1a1a1a;
}

.category-chip--selected {
  font-weight: 800;
  box-shadow: 4px 4px 0px #1a1a1a;
}

.category-chip--selected :deep(.q-chip) {
  font-weight: 800;
}

.filter-actions {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 3px solid #1a1a1a;
}

.filter-actions .q-btn {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  border: 2px solid #1a1a1a !important;
  border-radius: 0 !important;
  box-shadow: 2px 2px 0px #1a1a1a;
  transition: all 0.15s ease;
}

.filter-actions .q-btn:hover {
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0px #1a1a1a;
}

/* ==================== ACESSIBILIDADE - BRUTAL FOCUS ==================== */
.category-chip:focus-visible {
  outline: 3px solid #FFE500;
  outline-offset: 2px;
}

.q-btn:focus-visible {
  outline: 3px solid #FFE500;
  outline-offset: 2px;
}
</style>
