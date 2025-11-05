import { ref } from 'vue'

export function useCategorySelection() {
  const selected = ref([])

  function toggle(categoryLabel) {
    const index = selected.value.indexOf(categoryLabel)
    if (index > -1) {
      selected.value.splice(index, 1)
    } else {
      selected.value.push(categoryLabel)
    }
  }

  function clear() {
    selected.value = []
  }

  function set(categories) {
    selected.value = Array.isArray(categories) ? [...categories] : []
  }

  function isSelected(categoryLabel) {
    return selected.value.includes(categoryLabel)
  }

  return {
    selected,
    toggle,
    clear,
    set,
    isSelected,
  }
}

