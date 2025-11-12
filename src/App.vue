<template>
  <router-view />
</template>

<script setup>
import { inject } from '@vercel/analytics'

// Inicializa o Vercel Web Analytics
inject()
</script>

<style>
@import './css/accessibility.css';
</style>
