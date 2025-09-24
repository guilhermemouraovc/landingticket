<template>
  <q-layout view="hhh lpR fff">
    <q-header elevated class="bg-white text-dark">
      <q-toolbar class="q-py-sm">
        <q-toolbar-title class="row items-center no-wrap">
          <img src="/logo.svg" alt="Logo" style="height:28px" class="q-mr-sm" />
          <span class="text-weight-bold">Ticketpe</span>
        </q-toolbar-title>

        <div class="gt-sm row items-center q-gutter-md">
          <q-btn flat label="Recursos" @click="scrollTo('features')" />
          <q-btn flat label="Como funciona" @click="scrollTo('how')" />
          <q-btn flat label="Planos" @click="scrollTo('pricing')" />
          <q-btn flat label="FAQ" @click="scrollTo('faq')" />
          <q-btn color="primary" unelevated label="Começar agora" @click="scrollTo('cta')" />
        </div>

        <q-btn class="lt-md" flat round dense icon="menu" @click="rightDrawer = true" />
      </q-toolbar>
    </q-header>

    <q-drawer side="right" v-model="rightDrawer" overlay>
      <q-list>
        <q-item clickable v-ripple @click="go('features')"><q-item-section>Recursos</q-item-section></q-item>
        <q-item clickable v-ripple @click="go('how')"><q-item-section>Como funciona</q-item-section></q-item>
        <q-item clickable v-ripple @click="go('pricing')"><q-item-section>Planos</q-item-section></q-item>
        <q-item clickable v-ripple @click="go('faq')"><q-item-section>FAQ</q-item-section></q-item>
        <q-item clickable v-ripple @click="go('cta')"><q-item-section class="text-primary">Começar agora</q-item-section></q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-grey-1 text-grey-8">
      <div class="row items-center justify-between q-px-lg q-py-md">
        <div>© {{ new Date().getFullYear() }} Ticketpe — Todos os direitos reservados</div>
        <div class="row q-gutter-sm">
          <q-btn flat dense icon="mail" href="mailto:contato@suamarca.com" />
          <q-btn flat dense icon="smartphone" href="#" />
          <q-btn flat dense icon="share" href="#" />
        </div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
const rightDrawer = ref(false)

function scrollTo (id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
function go (id) {
  rightDrawer.value = false
  requestAnimationFrame(() => scrollTo(id))
}
</script>

<style>
/* deixa o header “grudar” bonito */
.q-header { border-bottom: 1px solid #eee; }
</style>
