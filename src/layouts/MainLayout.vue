<template> 
  <q-layout view="hHh lpR fFf">
    <!-- HEADER -->
    <q-header elevated class="bg-dark-header text-white">
      <q-toolbar class="custom-toolbar">
        <div class="header-inner">

          <!-- LOGO -->
          <div class="row items-center">
            <img src="/logo.svg" alt="Logo" style="width:220px" class="q-mr-sm" />
          </div>

          <!-- MENU DESKTOP -->
          <div class="row items-center gt-sm">
            <q-btn flat label="BLOG" class="text-white text-weight-bold" />
            <q-input
              class="search-pill q-my-xs"  
              filled
              rounded
              bg-color="white"
              placeholder="Pesquisar eventos"
              v-model="search"
            >
              <template #append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <!-- MENU MOBILE -->
          <q-btn class="lt-md" flat round dense icon="menu" @click="drawer = true" />
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

    <q-page-container>
      <router-view />
    </q-page-container>
    
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
const search = ref('')
const drawer = ref(false)
</script>

<style>
.bg-dark-header {
  background-color: #161F2F !important;
}

/* HEADER: altura total = 26(top) + 48(input) + 26(bottom) = 100px */
.custom-toolbar {
  min-height: 100px;
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

/* input “pill” = 440px largura x 48px altura */
.search-pill {
  width: 440px;
  height: 48px;
}
.search-pill .q-field__control {
  border-radius: 9999px !important;
  min-height: 48px;
}
.search-pill .q-field__native {
  padding: 10px 14px;
}
.search-pill input { color: #1f2937; }
.search-pill ::placeholder { color: #6b7280; }
.search-pill .q-field__append .q-icon { color: #64748b; }

/* fundo das áreas */
.q-page-container {
  background-color: #2A3447;
}
.q-drawer {
  background-color: #2A3447;
}
</style>
