<template>
  <div class="category-filter">
    <div class="filter-header">
      <q-icon name="category" size="20px" class="filter-header__icon" />
      <span class="filter-header__title">Categorias</span>
    </div>

    <div class="category-chips">
      <q-chip
        v-for="category in categories"
        :key="category.id"
        clickable
        :outline="!selectedCategories.includes(category.id)"
        :color="selectedCategories.includes(category.id) ? category.color : 'grey-3'"
        :text-color="selectedCategories.includes(category.id) ? 'white' : 'grey-8'"
        :icon="category.icon"
        class="category-chip"
        @click="toggleCategory(category.id)"
      >
        {{ category.name }}
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
        @click="clearCategories"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { CATEGORIES } from 'src/constants/config'

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
const categories = computed(() => CATEGORIES)

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
}

.category-chip {
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease;
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
</style>
