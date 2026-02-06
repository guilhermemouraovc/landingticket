<template>
  <div class="carva-anuncio-fullpage">
    <iframe src="/landing-brutal.html" frameborder="0"></iframe>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  document.title = 'Ticketpe - Carvalheira na Ladeira'
})
</script>

<style scoped>
.carva-anuncio-fullpage {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
}
.carva-anuncio-fullpage iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
