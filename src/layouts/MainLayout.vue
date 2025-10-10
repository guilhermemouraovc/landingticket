<template>
  <q-layout view="hHh lpR fFf">
    <!-- HEADER -->
    <q-header elevated class="bg-dark-header text-white">
      <q-toolbar class="custom-toolbar">
        <div class="header-inner">
          <!-- LOGO -->
          <div class="row items-center">
            <img
              src="/logo.svg"
              alt="TicketPE - Eventos em Pernambuco"
              style="width: 220px"
              class="q-mr-sm"
            />
          </div>

          <!-- MENU DESKTOP -->
          <div class="row items-center gt-sm">
            <q-btn
              flat
              no-caps
              label="Filtros"
              class="text-white text-weight-bold"
              aria-label="Abrir filtros de eventos"
              @click="filterDrawer = true"
            >
              <template #prepend>
                <q-icon
                  name="img:/public/sliders-horizontal 2.svg"
                  size="20px"
                  class="text-white"
                  aria-hidden="true"
                />
              </template>
            </q-btn>
            <q-input
              class="search-pill q-my-xs"
              filled
              square-rounded
              bg-color="white"
              placeholder="Pesquisar eventos"
              v-model="search"
              aria-label="Campo de busca de eventos"
              role="searchbox"
            >
              <template #append>
                <q-icon name="search" aria-hidden="true" />
              </template>
            </q-input>
          </div>

          <!-- MENU MOBILE -->
          <q-btn
            class="lt-md"
            flat
            round
            dense
            icon="menu"
            aria-label="Abrir menu de navegação"
            @click="drawer = true"
          />
        </div>
      </q-toolbar>
    </q-header>

    <!-- DRAWER MOBILE -->
    <q-drawer v-model="drawer" side="right" overlay>
      <q-list>
        <q-item clickable>
          <q-item-section>Blog</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- DRAWER DE FILTROS -->
    <q-drawer v-model="filterDrawer" side="right" overlay :width="400" class="filter-drawer">
      <div class="filter-drawer-content">
        <!-- Cabeçalho -->
        <div class="filter-drawer-header">
          <div class="filter-drawer-title">
            <q-icon name="tune" size="28px" color="primary" aria-hidden="true" />
            <span>Filtros</span>
          </div>
          <q-btn
            flat
            round
            dense
            icon="close"
            aria-label="Fechar filtros"
            @click="filterDrawer = false"
          />
        </div>

        <q-separator />

        <!-- Conteúdo dos filtros -->
        <div class="filter-drawer-body">
          <!-- Filtro de Categorias -->
          <CategoryFilter v-model="filters.categories" />

          <q-separator class="q-my-md" />

          <!-- Filtro de Data (Futuro) -->
          <div class="filter-section">
            <div class="filter-header">
              <q-icon name="event" size="20px" class="filter-header__icon" />
              <span class="filter-header__title">Data</span>
            </div>
            <div class="coming-soon">Em breve</div>
          </div>

          <q-separator class="q-my-md" />

          <!-- Filtro de Localização (Futuro) -->
          <div class="filter-section">
            <div class="filter-header">
              <q-icon name="place" size="20px" class="filter-header__icon" />
              <span class="filter-header__title">Localização</span>
            </div>
            <div class="coming-soon">Em breve</div>
          </div>
        </div>

        <!-- Footer com ações -->
        <div class="filter-drawer-footer">
          <q-btn
            flat
            no-caps
            label="Limpar tudo"
            color="grey-7"
            class="full-width q-mb-sm"
            aria-label="Limpar todos os filtros"
            @click="clearAllFilters"
          />
          <q-btn
            unelevated
            no-caps
            label="Aplicar filtros"
            color="primary"
            class="full-width"
            aria-label="Aplicar filtros selecionados"
            @click="applyFilters"
          />
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import CategoryFilter from 'src/components/CategoryFilter.vue'

const router = useRouter()
const route = useRoute()
const search = ref('')
const drawer = ref(false)
const filterDrawer = ref(false)

// Estado dos filtros
const filters = ref({
  categories: [],
  // Futuros filtros:
  // dateRange: null,
  // location: '',
})

// Debounce timer
let debounceTimer = null

// Watch no campo de busca com debounce de 300ms
watch(search, (newValue) => {
  // Limpa o timer anterior
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  // Se o campo estiver vazio, não faz nada
  if (!newValue || newValue.trim() === '') {
    return
  }

  // Cria novo timer de 300ms
  debounceTimer = setTimeout(() => {
    // Redireciona para a página de programação com query param
    router.push({
      path: '/programacao',
      query: {
        ...route.query,
        q: newValue.trim(),
      },
    })
  }, 300)
})

// Funções de filtro
function clearAllFilters() {
  filters.value.categories = []
  // Limpar outros filtros no futuro
}

function applyFilters() {
  // Monta query params baseado nos filtros ativos
  const query = { ...route.query }

  // Adiciona categorias selecionadas
  if (filters.value.categories.length > 0) {
    query.categories = filters.value.categories.join(',')
  } else {
    delete query.categories
  }

  // Navega para programação com filtros
  router.push({
    path: '/programacao',
    query,
  })

  // Fecha o drawer
  filterDrawer.value = false
}
</script>

<style>
.bg-dark-header {
  background-color: #161f2f !important;
}

/* HEADER: altura total = 26(top) + 48(input) + 26(bottom) = 100px */
.custom-toolbar {
  min-height: 48px;
  padding: 0;
}

/* container central com margens laterais de 80px */
.header-inner {
  width: calc(100vw - 160px); /* 80px cada lado */
  max-width: 1760px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* espaço entre Blog e o input */
.header-inner .gt-sm {
  column-gap: 26px;
}

/* input "pill" = 440px largura x 48px altura */
.search-pill {
  width: 440px;
  height: 48px;
}
.search-pill .q-field__control {
  border-radius: 8px !important;
  min-height: 48px;
}
.search-pill .q-field__native {
  padding: 10px 14px;
}
.search-pill input {
  color: #1f2937;
}
.search-pill ::placeholder {
  color: #6b7280;
}
.search-pill .q-field__append .q-icon {
  color: #64748b;
}

/* Estilo personalizado para o botão Filtros */
.q-btn[aria-label='Filtros'] .q-btn__content {
  font-family: 'Poppins', sans-serif !important;
  font-size: 16px !important;
  font-weight: 600 !important;
}
.q-btn[aria-label='Filtros'] .q-btn__prepend {
  margin-right: 8px;
}

/* fundo das áreas */
.q-page-container {
  background-color: #2a3447;
}
.q-drawer {
  background-color: #2a3447;
}

/* ==================== DRAWER DE FILTROS ==================== */
.filter-drawer {
  background-color: #ffffff !important;
}

.filter-drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.filter-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
}

.filter-drawer-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.filter-drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.filter-drawer-footer {
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.filter-section {
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

.coming-soon {
  padding: 32px 20px;
  text-align: center;
  color: #9ca3af;
  font-style: italic;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px dashed #d1d5db;
}

/* ==================== ACESSIBILIDADE - FOCUS STATES ==================== */
.q-btn:focus-visible,
.q-btn:focus {
  outline: 2px solid #35c7ee;
  outline-offset: 2px;
}

.q-input:focus-within .q-field__control {
  outline: 2px solid #35c7ee;
  outline-offset: 2px;
}

.q-chip:focus-visible {
  outline: 2px solid #35c7ee;
  outline-offset: 2px;
}
</style>
