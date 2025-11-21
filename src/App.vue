<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { inject } from '@vercel/analytics'
import { useAuth } from 'src/composables/useAuth'

// Inicializa o Vercel Web Analytics
inject()

// Inicializa a autenticação
const { initSession } = useAuth()

onMounted(() => {
  initSession()
})
</script>

<style>
@import './css/accessibility.css';
</style>
