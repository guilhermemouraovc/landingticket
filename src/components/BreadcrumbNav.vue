<template>
  <nav class="breadcrumbs" aria-label="Breadcrumbs">
    <ol class="breadcrumbs-list">
      <li v-for="(crumb, index) in crumbs" :key="index" class="breadcrumbs-item">
        <router-link
          v-if="crumb.to && index < crumbs.length - 1"
          :to="crumb.to"
          class="breadcrumbs-link"
        >
          <q-icon v-if="crumb.icon" :name="crumb.icon" size="18px" class="q-mr-xs" />
          {{ crumb.label }}
        </router-link>

        <span v-else class="breadcrumbs-current">
          <q-icon v-if="crumb.icon" :name="crumb.icon" size="18px" class="q-mr-xs" />
          {{ crumb.label }}
        </span>

        <q-icon
          v-if="index < crumbs.length - 1"
          name="chevron_right"
          size="16px"
          class="breadcrumbs-separator"
          aria-hidden="true"
        />
      </li>
    </ol>
  </nav>
</template>

<script setup>
defineProps({
  crumbs: {
    type: Array,
    required: true,
    // Formato: [{ label: 'Home', to: '/', icon: 'home' }, ...]
  },
})
</script>

<style scoped>
.breadcrumbs {
  margin-bottom: 24px;
}

.breadcrumbs-list {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  margin: 0;
  list-style: none;
  flex-wrap: wrap;
}

.breadcrumbs-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.breadcrumbs-link {
  display: flex;
  align-items: center;
  color: #9ca3af;
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s ease;
}

.breadcrumbs-link:hover {
  color: #35c7ee;
  text-decoration: underline;
}

.breadcrumbs-current {
  display: flex;
  align-items: center;
  color: #f9fafb;
  font-weight: 600;
  font-size: 0.95rem;
}

.breadcrumbs-separator {
  color: #6b7280;
}

/* Acessibilidade - Focus state */
.breadcrumbs-link:focus-visible {
  outline: 2px solid #35c7ee;
  outline-offset: 4px;
  border-radius: 4px;
}
</style>
