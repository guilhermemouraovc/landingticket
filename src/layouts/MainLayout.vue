<template>
  <q-layout view="hHh lpR fFf">
    <!-- HEADER -->
    <q-header elevated class="bg-dark-header text-white">
      <q-toolbar class="custom-toolbar">
        <div class="header-inner">
          <!-- LOGO -->
          <router-link to="/" class="logo-link">
            <div class="row items-center">
              <img
                src="/logo.svg"
                alt="TicketPE - Eventos em Pernambuco"
                style="width: 220px"
                class="q-mr-sm"
              />
              <!-- Admin Panel Button (Only visible if logged in) -->
              <q-btn
                v-if="isAdmin"
                flat
                dense
                no-caps
                size="sm"
                color="positive"
                icon="admin_panel_settings"
                label="Admin"
                to="/melanciamaluca"
                class="q-ml-sm gt-sm"
              >
                <q-tooltip>Painel Admin</q-tooltip>
              </q-btn>
            </div>
          </router-link>

          <!-- MENU DESKTOP -->
          <div class="row items-center gt-sm">
            <!-- Container de filtros unificado -->
            <div
              v-if="!isEventDetailPage"
              class="filter-container"
              :class="{ 'filter-container--active': showCategories }"
              @click="toggleCategories"
              aria-label="Abrir filtros de eventos"
              role="button"
              tabindex="0"
              @keydown.enter="toggleCategories"
              @keydown.space="toggleCategories"
            >
              <FilterIcon size="32" fill="white" />
              <span class="filter-text">Filtros</span>
            </div>
            <q-input
              v-if="!isEventDetailPage"
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
          <div class="row items-center lt-md" style="gap: 12px">
            <!-- Botão de Filtro Mobile -->
            <div
              v-if="!isEventDetailPage"
              class="filter-container-mobile"
              :class="{
                'filter-container-mobile--active': filterDrawer,
                'filter-container-mobile--has-selection': selectedCategories.length > 0,
              }"
              @click="openFilterDrawer"
              aria-label="Abrir filtros de eventos"
              role="button"
              tabindex="0"
              @keydown.enter="openFilterDrawer"
              @keydown.space="openFilterDrawer"
            >
              <FilterIcon size="32" fill="white" />
            </div>

            <!-- Botão de Pesquisa Mobile -->
            <q-btn
              v-if="!isEventDetailPage"
              class="search-button-mobile"
              flat
              round
              dense
              icon="search"
              aria-label="Mostrar barra de pesquisa"
              @click="toggleSearchMobile"
            />
          </div>
        </div>
      </q-toolbar>

      <!-- Barra de pesquisa mobile (aparece quando showSearchMobile é true) -->
      <div v-if="!isEventDetailPage && showSearchMobile" class="search-mobile-container lt-md">
        <q-input
          class="search-mobile-input"
          filled
          square-rounded
          bg-color="white"
          placeholder="Pesquisar eventos"
          v-model="search"
          aria-label="Campo de busca de eventos"
          role="searchbox"
          autofocus
        >
          <template #append>
            <q-icon name="search" aria-hidden="true" />
          </template>
        </q-input>
      </div>

      <!-- CATEGORIAS EXPANSÍVEIS -->
      <div class="categories-drawer" :class="{ 'categories-drawer--open': showCategories }">
        <div class="categories-content">
          <div class="categories-grid">
            <!-- Se tem categorias selecionadas e não está expandido, mostra apenas as selecionadas -->
            <template v-if="selectedCategories.length > 0 && !showAllCategories && categories">
              <q-btn
                v-for="category in categories.filter((c) => selectedCategories.includes(c.label))"
                :key="category.label"
                outline
                square-rounded
                no-caps
                class="category-btn category-btn--active"
                color="white"
                text-color="white"
                :aria-label="`Filtrar eventos de ${category.label}`"
                @click="selectCategory(category.label)"
              >
                <template #default>
                  <span class="category-btn-content">
                    <CategoryIcon
                      :icon="category.icon"
                      :size="20"
                      color="white"
                      icon-class="category-btn-icon"
                    />
                    <span class="category-btn-label">{{ category.label }}</span>
                  </span>
                </template>
              </q-btn>
              <q-btn
                flat
                round
                dense
                icon="add"
                class="add-category-btn"
                color="white"
                aria-label="Mostrar mais categorias"
                @click="expandCategories"
              />
            </template>
            <!-- Caso contrário, mostra categorias limitadas ou todas -->
            <template v-else>
              <q-btn
                v-for="category in visibleCategories"
                :key="category.label"
                outline
                square-rounded
                no-caps
                class="category-btn"
                :class="{ 'category-btn--active': selectedCategories.includes(category.label) }"
                color="white"
                text-color="white"
                :aria-label="`Filtrar eventos de ${category.label}`"
                @click="selectCategory(category.label)"
              >
                <template #default>
                  <span class="category-btn-content">
                    <CategoryIcon
                      :icon="category.icon"
                      :size="20"
                      color="white"
                      icon-class="category-btn-icon"
                    />
                    <span class="category-btn-label">{{ category.label }}</span>
                  </span>
                </template>
              </q-btn>
              <!-- Botão para expandir categorias (só aparece se houver mais de 9 e não estiver expandido) -->
              <q-btn
                v-if="!showAllCategories && categories && categories.length > 9"
                flat
                round
                dense
                icon="add"
                class="add-category-btn"
                color="white"
                aria-label="Mostrar mais categorias"
                @click="expandCategories"
              />
            </template>
          </div>
        </div>
      </div>
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
    <q-drawer
      :model-value="filterDrawer"
      @update:model-value="handleDrawerUpdate"
      side="right"
      overlay
      :width="$q.screen.lt.sm ? undefined : 400"
      :behavior="$q.screen.lt.sm ? 'mobile' : 'default'"
      class="filter-drawer"
      :transition-duration="$q.screen.lt.sm ? 350 : 200"
      :transition-show="'slide-left'"
      :transition-hide="'slide-right'"
      :no-swipe-backdrop="$q.screen.lt.sm"
    >
      <div
        class="filter-drawer-content"
        :class="{ 'filter-drawer-content--hidden': !filterDrawerContentVisible }"
      >
        <!-- Cabeçalho -->
        <div
          class="filter-drawer-header"
          :class="{ 'filter-drawer-header--has-selection': selectedCategories.length > 0 }"
        >
          <div class="filter-drawer-title">
            <q-icon
              name="tune"
              size="28px"
              :color="
                $q.screen.lt.sm ? (selectedCategories.length > 0 ? '#35c7ee' : 'white') : 'primary'
              "
              aria-hidden="true"
            />
            <span
              :class="{
                'text-white': $q.screen.lt.sm && selectedCategories.length === 0,
                'filter-drawer-title--has-selection': selectedCategories.length > 0,
              }"
            >
              Filtros
            </span>
          </div>
          <q-btn
            flat
            round
            dense
            icon="close"
            :color="$q.screen.lt.sm ? 'white' : 'dark'"
            aria-label="Fechar filtros"
            :disable="isDrawerTransitioning"
            @click="closeFilterDrawer"
          />
        </div>

        <q-separator :dark="$q.screen.lt.sm" />

        <!-- Conteúdo dos filtros -->
        <div class="filter-drawer-body">
          <!-- Mobile: Categorias empilhadas -->
          <template v-if="$q.screen.lt.sm">
            <div class="category-list-mobile">
              <!-- Texto "Limpar" acima da primeira categoria -->
              <div v-if="selectedCategories.length > 0" class="clear-categories-wrapper">
                <span
                  class="clear-categories-text"
                  @click="clearAllCategories"
                  aria-label="Limpar todas as categorias"
                >
                  Limpar
                </span>
              </div>
              <q-btn
                v-for="category in categories || []"
                :key="category.label"
                unelevated
                no-caps
                class="category-btn-mobile"
                :class="{
                  'category-btn-mobile--active': selectedCategories.includes(category.label),
                }"
                :aria-label="`Filtrar eventos de ${category.label}`"
                @click="selectCategoryMobile(category.label)"
              >
                <template #default>
                  <span class="category-btn-mobile-content">
                    <CategoryIcon
                      :icon="category.icon"
                      :size="20"
                      color="white"
                      icon-class="category-btn-mobile-icon"
                    />
                    <span class="category-btn-mobile-label">{{ category.label }}</span>
                  </span>
                </template>
              </q-btn>
            </div>
          </template>

          <!-- Desktop: Filtro de Categorias (chips) -->
          <template v-else>
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
          </template>
        </div>

        <!-- Footer com ações (apenas desktop) -->
        <div v-if="!$q.screen.lt.sm" class="filter-drawer-footer">
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
      <div class="main-container">
        <router-view />
      </div>
    </q-page-container>

    <!-- FOOTER -->
    <footer class="footer" role="contentinfo">
      <div class="footer-wrap">
        <div class="footer-top row items-center justify-between q-mb-lg">
          <router-link to="/" class="footer-logo-container">
            <img
              src="/logo.svg"
              alt="TicketPE - Eventos em Pernambuco"
              style="width: 280px"
              loading="lazy"
            />
          </router-link>

          <div class="social-icons row q-gutter-md">
            <a
              href="https://chat.whatsapp.com/HLtVXbX4PbO1RVW317mLlB?mode=wwt"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              aria-label="WhatsApp"
            >
              <img src="/whatsapp.svg" alt="WhatsApp" class="social-icon" />
            </a>
            <a
              href="https://www.instagram.com/ticketpe"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              aria-label="Instagram"
            >
              <img src="/insta.svg" alt="Instagram" class="social-icon" />
            </a>
            <a
              href="https://www.tiktok.com/@ticketpe"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              aria-label="TikTok"
            >
              <img src="/tiktok.svg" alt="TikTok" class="social-icon" />
            </a>
          </div>
        </div>

        <q-separator dark />

        <div class="footer-links row justify-between q-mt-lg">
          <div class="footer-column">
            <div class="footer-title">Links Úteis</div>
            <router-link to="/programacao" class="footer-link">Programação Completa</router-link>
            <router-link to="/quem-somos" class="footer-link">Quem Somos</router-link>
            <router-link to="/embaixadores" class="footer-link">Seja um Embaixador</router-link>
          </div>

          <div class="footer-column">
            <div class="footer-title">Compra Segura</div>
            <div class="payment-methods">
              <div class="payment-method">
                <img src="/VISA.svg" alt="Visa" class="payment-icon" />
              </div>
              <div class="payment-method">
                <img src="/Mastercard.svg" alt="Mastercard" class="payment-icon" />
              </div>
              <div class="payment-method">
                <img src="/PIX.svg" alt="PIX" class="payment-icon" />
              </div>
            </div>
            <div class="reclame-aqui-seal">
              <img
                src="/reclameaquiselo 1.png"
                alt="Reclame Aqui - Selo RA1000"
                class="reclame-aqui-icon"
                width="114"
                height="84"
              />
            </div>
          </div>

          <div class="footer-column">
            <div class="footer-title">Contato</div>
            <div class="footer-link">ajuda@ticketpe.com.br</div>
            <div class="footer-link">81 99847-1385</div>
          </div>

          <div class="footer-column">
            <div class="footer-title">Suporte</div>
            <router-link to="/termos-de-uso" class="footer-link">Termos de Uso</router-link>
            <router-link to="/politica-de-privacidade" class="footer-link"
              >Política de Privacidade</router-link
            >
          </div>
        </div>

        <q-separator dark class="q-mt-lg" />

        <div class="footer-copyright">
          © 2026 Ticketpe, inscrito no CNPJ 58.884.757/0001-47. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  </q-layout>
</template>

<script setup>
import { ref, watch, provide, onMounted, onUnmounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import CategoryFilter from 'src/components/CategoryFilter.vue'
import CategoryIcon from 'src/components/CategoryIcon.vue'
import FilterIcon from 'src/components/FilterIcon.vue'
import { useQuasar } from 'quasar'
import { useCategories } from 'src/composables/useCategories'
import { useAuth } from 'src/composables/useAuth'

const router = useRouter()
const route = useRoute()
const search = ref('')
const drawer = ref(false)
const filterDrawer = ref(false)
const filterDrawerContentVisible = ref(true)
const showSearchMobile = ref(false)
const $q = useQuasar()
const isDrawerTransitioning = ref(false) // Flag para prevenir múltiplos cliques durante transição
const savedScrollPosition = ref(0) // Preserva a posição de scroll quando o drawer abre

// Auth
const { isAdmin, initSession } = useAuth()
const { categories, loadCategories } = useCategories()

// Estado das categorias expansíveis
const showCategories = ref(false)
const selectedCategories = ref([]) // Array de labels de categorias selecionadas
const showAllCategories = ref(false) // Controla se mostra todas ou apenas as selecionadas

// Computed para retornar apenas as primeiras 9 categorias ou todas
const visibleCategories = computed(() => {
  if (!categories.value) return []
  if (showAllCategories.value) {
    return categories.value
  }
  return categories.value.slice(0, 9)
})

// Detectar se estamos na página de detalhes do evento
const isEventDetailPage = computed(() => {
  return route.name === 'event-detail'
})

// Estado dos filtros
const filters = ref({
  categories: [],
  // Futuros filtros:
  // dateRange: null,
  // location: '',
})

// Debounce timer
let debounceTimer = null

// Carrega categorias ao montar o componente
onMounted(async () => {
  await initSession()
  await loadCategories()
})

// Limpeza ao desmontar: restaura o body se o drawer estiver aberto
onUnmounted(() => {
  if (filterDrawer.value && $q.screen.lt.sm) {
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.width = ''
    document.body.style.top = ''
  }
})

// Função para alternar a exibição das categorias
function toggleCategories() {
  showCategories.value = !showCategories.value
  // Reseta showAllCategories quando fecha a gaveta
  if (!showCategories.value) {
    showAllCategories.value = false
  }
}

// Função para selecionar/deselecionar uma categoria (suporta múltiplas seleções)
function selectCategory(categoryLabel) {
  const currentIndex = selectedCategories.value.indexOf(categoryLabel)

  if (currentIndex > -1) {
    // Se já está selecionada, remove
    selectedCategories.value.splice(currentIndex, 1)
  } else {
    // Adiciona à lista de categorias selecionadas
    selectedCategories.value.push(categoryLabel)
  }

  // Emite evento para a página atual
  window.dispatchEvent(
    new CustomEvent('categorySelected', {
      detail: {
        category: selectedCategories.value.length === 1 ? selectedCategories.value[0] : null,
        categories: selectedCategories.value,
      },
    }),
  )
}

// Função para selecionar categoria no mobile (mantém o drawer aberto)
function selectCategoryMobile(categoryLabel) {
  // Previne cliques durante transição
  if (isDrawerTransitioning.value) {
    return
  }
  selectCategory(categoryLabel)
  // O drawer permanece aberto para permitir múltiplas seleções
}

// Função para limpar todas as categorias selecionadas (mobile)
function clearAllCategories() {
  if (isDrawerTransitioning.value) {
    return
  }
  selectedCategories.value = []
  // Emite evento para a página atual
  window.dispatchEvent(
    new CustomEvent('categorySelected', {
      detail: {
        category: null,
        categories: [],
      },
    }),
  )
}

// Função para expandir e mostrar todas as categorias
function expandCategories() {
  showAllCategories.value = true
}

// Provide para comunicação com páginas filhas
provide('selectedCategories', selectedCategories)
provide('selectCategory', selectCategory)

// Watch para controlar visibilidade do conteúdo do drawer e bloquear scroll do body
watch(filterDrawer, (newValue) => {
  if (newValue) {
    // Bloqueia scroll do body no mobile quando o drawer está aberto
    if ($q.screen.lt.sm) {
      // Preserva a posição de scroll atual antes de bloquear
      savedScrollPosition.value = window.scrollY || window.pageYOffset || 0
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.top = `-${savedScrollPosition.value}px`
    }

    // Reseta visibilidade e anima o conteúdo
    filterDrawerContentVisible.value = false
    isDrawerTransitioning.value = true

    // Quando abre, mostra o conteúdo com um pequeno delay para criar efeito em cascata
    setTimeout(() => {
      filterDrawerContentVisible.value = true
      // Libera a flag após a animação de entrada
      setTimeout(() => {
        isDrawerTransitioning.value = false
      }, 350)
    }, 50)
  } else {
    // Quando fecha, esconde o conteúdo rapidamente (antes do drawer)
    isDrawerTransitioning.value = true
    filterDrawerContentVisible.value = false

    // Restaura scroll do body no mobile quando o drawer fecha
    if ($q.screen.lt.sm) {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''

      // Restaura a posição de scroll após um pequeno delay para garantir que o DOM foi atualizado
      setTimeout(() => {
        window.scrollTo(0, savedScrollPosition.value)
      }, 0)

      // Libera a flag após a animação de saída
      setTimeout(() => {
        isDrawerTransitioning.value = false
      }, 350)
    } else {
      setTimeout(() => {
        isDrawerTransitioning.value = false
      }, 200)
    }
  }
})

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
  const hadFilter = filters.value.categories.length > 0

  filters.value.categories = []

  if (hadFilter) {
    $q.notify({
      type: 'info',
      message: 'Todos os filtros foram removidos',
      position: 'top',
      timeout: 2000,
      icon: 'clear_all',
    })
  }
}

function openFilterDrawer() {
  // Previne múltiplos cliques rápidos durante transição
  if (isDrawerTransitioning.value || filterDrawer.value) {
    return
  }

  showSearchMobile.value = false // Fecha a barra de pesquisa se estiver aberta
  // Reseta a visibilidade para criar o efeito de animação
  filterDrawerContentVisible.value = false
  filterDrawer.value = true
  // O watch vai fazer o conteúdo aparecer com delay para criar efeito em cascata
}

function closeFilterDrawer() {
  // Previne múltiplos cliques rápidos durante transição
  if (isDrawerTransitioning.value || !filterDrawer.value) {
    return
  }
  filterDrawer.value = false
}

// Handler para atualizações do drawer (incluindo cliques no backdrop)
function handleDrawerUpdate(newValue) {
  // Se está tentando fechar durante transição, previne
  if (!newValue && (isDrawerTransitioning.value || !filterDrawer.value)) {
    // Mantém o valor atual se estiver em transição
    return
  }
  // Permite a atualização normalmente (o watch vai cuidar do resto)
  filterDrawer.value = newValue
}

function toggleSearchMobile() {
  if (filterDrawer.value) {
    closeFilterDrawer()
  }
  showSearchMobile.value = !showSearchMobile.value
}

function applyFilters() {
  const query = { ...route.query }
  let activeFiltersCount = 0

  // Conta filtros ativos
  if (filters.value.categories.length > 0) {
    query.categories = filters.value.categories.join(',')
    activeFiltersCount += filters.value.categories.length
  } else {
    delete query.categories
  }

  router.push({
    path: '/programacao',
    query,
  })

  filterDrawer.value = false

  if (activeFiltersCount > 0) {
    $q.notify({
      type: 'positive',
      message: `${activeFiltersCount} ${activeFiltersCount === 1 ? 'filtro aplicado' : 'filtros aplicados'}`,
      position: 'top',
      timeout: 2000,
      icon: 'filter_alt',
    })
  } else {
    $q.notify({
      type: 'info',
      message: 'Mostrando todos os eventos',
      position: 'top',
      timeout: 2000,
    })
  }
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

/* container central com margens laterais responsivas */
.header-inner {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@media (min-width: 1600px) {
  .header-inner {
    max-width: 1600px;
  }

  .categories-grid {
    max-width: 1600px;
  }
}

@media (min-width: 1920px) {
  .header-inner {
    max-width: 1800px;
  }

  .categories-grid {
    max-width: 1800px;
  }
}

/* espaço entre elementos da header */
.header-inner .gt-sm {
  column-gap: 26px;
}

/* Logo clicável */
.logo-link {
  text-decoration: none;
  cursor: pointer;
  display: inline-block;
}

.logo-link:hover {
  opacity: 0.9;
}

/* ==================== CONTAINER DE FILTROS UNIFICADO ==================== */
.filter-container {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.filter-container--active {
  background-color: transparent;
}

.filter-container--active .filter-icon path,
.filter-container--active .filter-text {
  color: #35c7ee !important;
  fill: #35c7ee !important;
}

.filter-container:hover .filter-icon path,
.filter-container:hover .filter-text {
  color: #35c7ee !important;
  fill: #35c7ee !important;
}

.filter-text {
  color: white;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 600;
  transition: color 0.3s ease;
}

.filter-icon {
  transition: fill 0.3s ease;
}

.filter-icon path {
  transition: fill 0.3s ease;
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
.filter-btn {
  transition: all 0.3s ease;
}

.filter-btn--active {
  background-color: transparent !important;
  color: #35c7ee !important;
}
.filter-btn--active .q-btn__content {
  color: #35c7ee !important;
}

.filter-btn .q-btn__content {
  font-family: 'Poppins', sans-serif !important;
  font-size: 16px !important;
  font-weight: 600 !important;
}
.filter-btn .q-btn__prepend {
  margin-right: 8px;
}

.filter-btn--active .q-icon {
  color: #35c7ee !important;
}
/* ==================== CATEGORIAS EXPANSÍVEIS ==================== */
.categories-drawer {
  background-color: #161f2f;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease-out;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.categories-drawer--open {
  max-height: 200px; /* Altura suficiente para as categorias */
}

.categories-content {
  padding: 20px 0;
}

.categories-grid {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 80px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: center;
}

.category-btn {
  border-radius: 12px !important;
  height: 52px;
  min-width: 180px;
  font-weight: 600;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  outline: none !important;
}

.category-btn:hover {
  background: #35c7ee !important;
  border-color: #35c7ee !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(53, 199, 238, 0.3);
}

.category-btn--active {
  background: linear-gradient(90deg, #008ec1 0%, #35c7ee 100%) !important;
  border: none !important;
  color: white !important;
}

.category-btn .q-btn__content {
  font-weight: 700;
  letter-spacing: 0.3px;
  color: white !important;
}

.category-btn .q-icon {
  margin-right: 8px;
  font-size: 20px;
}

/* Estilos para o conteúdo dos botões com ícones */
.category-btn-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-btn-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

/* Estilos para ícones Phosphor dentro dos botões */
.category-btn :deep(.phosphor-icon svg) {
  width: 20px;
  height: 20px;
  fill: currentColor;
  color: white;
}

.category-btn-mobile-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-btn-mobile-icon {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
}

.category-btn-mobile :deep(.phosphor-icon svg) {
  width: 22px;
  height: 22px;
  fill: currentColor;
  color: white;
}

.add-category-btn {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.add-category-btn:hover {
  background: linear-gradient(90deg, #008ec1 0%, #35c7ee 100%) !important;

  border-color: #35c7ee !important;
}

/* Mobile */
@media (max-width: 599px) {
  .header-inner {
    padding: 0 16px;
  }

  .categories-grid {
    width: calc(100vw - 32px);
    padding: 0 16px;
    gap: 8px;
  }

  .category-btn {
    min-width: 140px;
    height: 48px;
    font-size: 14px;
  }

  .add-category-btn {
    width: 48px;
    height: 48px;
  }

  /* Botão de filtro mobile */
  .filter-container-mobile {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    padding: 0;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 8px;
  }

  .filter-container-mobile:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .filter-container-mobile--active .filter-icon path,
  .filter-container-mobile--has-selection .filter-icon path {
    fill: #35c7ee;
  }

  .filter-container-mobile .filter-icon {
    width: 32px;
    height: 32px;
  }

  /* Botão de pesquisa mobile */
  .search-button-mobile {
    color: white !important;
  }

  .search-button-mobile:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  /* Container da barra de pesquisa mobile */
  .search-mobile-container {
    background-color: #161f2f;
    padding: 12px 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .search-mobile-input {
    width: 100%;
  }

  .search-mobile-input .q-field__control {
    border-radius: 8px !important;
    min-height: 44px;
  }

  .search-mobile-input .q-field__native {
    padding: 10px 14px;
  }

  .search-mobile-input input {
    color: #1f2937;
  }

  .search-mobile-input ::placeholder {
    color: #6b7280;
  }

  .search-mobile-input .q-field__append .q-icon {
    color: #64748b;
  }
}

/* Tablet */
@media (min-width: 600px) and (max-width: 768px) {
  .header-inner {
    padding: 0 40px;
  }

  .categories-grid {
    width: calc(100vw - 80px);
    padding: 0 40px;
    gap: 8px;
  }

  .category-btn {
    min-width: 140px;
    height: 48px;
    font-size: 14px;
  }

  .add-category-btn {
    width: 48px;
    height: 48px;
  }
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

/* Mobile: drawer com fundo escuro e animação fluida */
@media (max-width: 599px) {
  .filter-drawer {
    background-color: #2a3447 !important;
  }

  /* Animação customizada tipo gaveta para mobile */
  .filter-drawer :deep(.q-drawer__inner) {
    width: 100% !important;
    transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
    will-change: transform;
    height: 100vh;
    max-height: 100vh;
    overflow: hidden;
  }

  /* Animação do overlay */
  .filter-drawer :deep(.q-drawer__backdrop) {
    transition: opacity 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
    will-change: opacity;
    background-color: rgba(0, 0, 0, 0.5);
  }

  /* Garante que o drawer não cause overflow horizontal */
  .filter-drawer :deep(.q-drawer__container) {
    overflow-x: hidden;
    max-width: 100vw;
  }
}

.filter-drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100vh;
  overflow: hidden;
  transition:
    opacity 0.2s ease-out,
    transform 0.2s ease-out;
  opacity: 1;
  transform: translateX(0);
}

.filter-drawer-content--hidden {
  opacity: 0;
  pointer-events: none;
  transform: translateX(20px);
  transition:
    opacity 0.15s ease-out,
    transform 0.15s ease-out;
}

.filter-drawer-content--hidden .category-btn-mobile {
  animation: none;
  opacity: 0;
  transform: translateX(20px);
  transition:
    opacity 0.15s ease-out,
    transform 0.15s ease-out;
}

/* Mobile: animação mais fluida do conteúdo */
@media (max-width: 599px) {
  .filter-drawer-content {
    transition:
      opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.05s,
      transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.05s;
  }

  .filter-drawer-content--hidden {
    transition:
      opacity 0.2s cubic-bezier(0.55, 0.06, 0.68, 0.19),
      transform 0.2s cubic-bezier(0.55, 0.06, 0.68, 0.19);
  }

  .filter-drawer-content--hidden .category-btn-mobile {
    animation: none;
    opacity: 0;
    transform: translateX(20px);
    transition:
      opacity 0.15s cubic-bezier(0.55, 0.06, 0.68, 0.19),
      transform 0.15s cubic-bezier(0.55, 0.06, 0.68, 0.19);
  }
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
  overflow-x: hidden;
  padding: 24px;
  -webkit-overflow-scrolling: touch; /* Scroll suave no iOS */
}

/* Mobile: ajuste do padding */
@media (max-width: 599px) {
  .filter-drawer-body {
    padding: 20px 16px;
  }

  .filter-drawer-header {
    padding: 20px 16px;
  }

  /* Separador mais visível no fundo escuro */
  .filter-drawer .q-separator {
    background-color: rgba(255, 255, 255, 0.1) !important;
  }

  /* Quando há categorias selecionadas, ícone e texto ficam azuis */
  .filter-drawer-header--has-selection .filter-drawer-title--has-selection {
    color: #35c7ee !important;
  }

  /* Garante que apenas o ícone do título (tune) fique azul quando há categorias selecionadas */
  /* O botão de fechar (X) permanece branco */
  .filter-drawer-header--has-selection .filter-drawer-title .q-icon {
    color: #35c7ee !important;
  }
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

/* ==================== CATEGORIAS EMPILHADAS MOBILE ==================== */
.category-list-mobile {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0;
}

.category-btn-mobile {
  width: 100%;
  height: 56px;
  border-radius: 12px !important;
  background-color: #374151 !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: white !important;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 600;
  justify-content: flex-start;
  padding-left: 16px;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  opacity: 0;
  transform: translateX(20px);
  animation: slideInButton 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

/* Delays de animação para os botões de categoria */
.category-list-mobile .category-btn-mobile:nth-of-type(1) {
  animation-delay: 0.1s;
}
.category-list-mobile .category-btn-mobile:nth-of-type(2) {
  animation-delay: 0.15s;
}
.category-list-mobile .category-btn-mobile:nth-of-type(3) {
  animation-delay: 0.2s;
}
.category-list-mobile .category-btn-mobile:nth-of-type(4) {
  animation-delay: 0.25s;
}
.category-list-mobile .category-btn-mobile:nth-of-type(5) {
  animation-delay: 0.3s;
}
.category-list-mobile .category-btn-mobile:nth-of-type(6) {
  animation-delay: 0.35s;
}
.category-list-mobile .category-btn-mobile:nth-of-type(7) {
  animation-delay: 0.4s;
}
.category-list-mobile .category-btn-mobile:nth-of-type(8) {
  animation-delay: 0.45s;
}

@keyframes slideInButton {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.category-btn-mobile .q-btn__content {
  color: white !important;
}

.category-btn-mobile .q-icon {
  margin-right: 12px;
  font-size: 22px;
}

.category-btn-mobile:hover {
  background-color: #4b5563 !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
}

.category-btn-mobile--active {
  background: linear-gradient(90deg, #008ec1 0%, #35c7ee 100%) !important;
  border-color: #35c7ee !important;
}

.category-btn-mobile--active .q-btn__content {
  color: white !important;
}

/* Container do texto "Limpar" acima da primeira categoria (mobile) */
.clear-categories-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
  padding: 0 4px;
  opacity: 0;
  animation: slideInButton 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.05s forwards;
}

/* Texto "Limpar" (mobile) */
.clear-categories-text {
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.2s ease;
  user-select: none;
  font-family: 'Poppins', sans-serif;
}

.clear-categories-text:hover {
  color: #35c7ee;
}

/* ==================== PREVENÇÃO DE SCROLL HORIZONTAL ==================== */
html,
body {
  overflow-x: hidden;
  max-width: 100vw;
}

.q-layout {
  overflow-x: hidden;
}

/* ==================== CONTAINER RESPONSIVO ==================== */
.main-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 80px;
}

/* Mobile */
@media (max-width: 599px) {
  .main-container {
    padding: 0 16px;
  }
}

/* Tablet */
@media (min-width: 600px) and (max-width: 1023px) {
  .main-container {
    padding: 0 40px;
  }
}

@media (min-width: 1600px) {
  .main-container {
    max-width: 1600px;
    padding: 0 40px;
  }
}

@media (min-width: 1920px) {
  .main-container {
    max-width: 1800px;
    padding: 0 60px;
  }
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

/* ================= FOOTER ================= */
.footer {
  background-color: #1a202c;
  padding: 32px 0;
  color: white;
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}

.footer-wrap {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 80px;
}

@media (min-width: 1600px) {
  .footer-wrap {
    max-width: 1600px;
  }
}

@media (min-width: 1920px) {
  .footer-wrap {
    max-width: 1800px;
    padding: 0 80px;
  }
}

.footer-logo-container {
  display: flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.footer-logo-container:hover {
  opacity: 0.9;
}

.social-icons {
  display: flex;
  gap: 8px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: transform 0.3s ease;
}

.social-link:hover {
  transform: translateY(-2px);
}

.social-icon {
  width: 55.8px;
  height: 55.8px;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: white;
  margin-bottom: 8px;
}

.footer-link {
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: #d1d5db;
  cursor: pointer;
  transition: color 0.2s ease;
  text-decoration: none;
  display: block;
}

.footer-link:hover {
  color: #35c7ee;
}

a.footer-link {
  text-decoration: none;
}

a.footer-link:hover {
  text-decoration: none;
}

.footer-copyright {
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: #d1d5db;
  text-align: left;
  margin-top: 16px;
  padding-top: 26px;
  padding-bottom: 26px;
}

.footer .q-separator {
  background-color: rgba(250, 253, 255, 0.2) !important;
}

.footer-top {
  margin-bottom: 32px !important;
}

/* Telas grandes */
@media (min-width: 1200px) {
  .footer-links {
    gap: 60px;
  }
}

@media (min-width: 1600px) {
  .footer-links {
    gap: 80px;
  }
}

/* Mobile */
@media (max-width: 599px) {
  .footer-wrap {
    padding: 0 16px;
  }

  .footer-links {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .footer-top {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }

  .social-icons {
    justify-content: center;
  }

  .footer {
    margin-bottom: 0;
    padding-bottom: env(safe-area-inset-bottom, 48px);
    min-height: auto;
    position: relative;
  }
}

/* Tablet */
@media (min-width: 600px) and (max-width: 768px) {
  .footer-wrap {
    padding: 0 40px;
  }

  .footer-links {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .footer-top {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }

  .social-icons {
    justify-content: center;
  }
}

.social-icon:focus-visible {
  outline: 2px solid #35c7ee;
  outline-offset: 2px;
  border-radius: 50%;
}

/* ================= COMPRA SEGURA ================= */
.payment-methods {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.payment-method {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.payment-icon {
  width: 35px;
  height: 23px;
  object-fit: contain;
  opacity: 0.9;
  transition: opacity 0.3s ease;
}

.payment-method:hover .payment-icon {
  opacity: 1;
  filter: brightness(1.1);
}

/* Selo Reclame Aqui */
.reclame-aqui-seal {
  display: flex;
  align-items: center;
  margin-top: 16px;
}

.reclame-aqui-icon {
  width: 114px;
  height: 84px;
  object-fit: contain;
  transition: all 0.3s ease;
}

.reclame-aqui-icon:hover {
  transform: scale(1.05);
  filter: brightness(1.1);
}

/* Mobile */
@media (max-width: 599px) {
  .footer-links {
    grid-template-columns: 1fr;
  }

  .payment-methods {
    gap: 10px;
  }
}

/* Tablet */
@media (min-width: 600px) and (max-width: 1023px) {
  .footer-links {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
