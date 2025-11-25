<template>
  <router-view />
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { inject } from '@vercel/analytics'
import { useAuth } from 'src/composables/useAuth'

// Inicializa o Vercel Web Analytics
inject()

// Inicializa a autenticação
const { initSession } = useAuth()

// Proteção de imagens - desabilita menu de contexto
const handleContextMenu = (e) => {
  const target = e.target
  // Bloqueia clique direito em imagens e elementos q-img
  if (
    target.tagName === 'IMG' ||
    target.closest('.q-img') ||
    target.classList.contains('q-img__image')
  ) {
    e.preventDefault()
    return false
  }
}

// Proteção contra arrastar imagens
const handleDragStart = (e) => {
  if (e.target.tagName === 'IMG' || e.target.closest('.q-img')) {
    e.preventDefault()
    return false
  }
}

onMounted(() => {
  initSession()
  
  // Adiciona listeners de proteção de imagens
  document.addEventListener('contextmenu', handleContextMenu)
  document.addEventListener('dragstart', handleDragStart)
})

onUnmounted(() => {
  // Remove listeners ao desmontar
  document.removeEventListener('contextmenu', handleContextMenu)
  document.removeEventListener('dragstart', handleDragStart)
})
</script>

<style>
@import './css/accessibility.css';
</style>
