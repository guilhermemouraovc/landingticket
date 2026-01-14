<template>
  <div class="metrics-page">
    <iframe
      src="/metrics-dashboard.html"
      class="metrics-iframe"
      frameborder="0"
    ></iframe>
    <q-btn
      class="back-btn"
      flat
      round
      icon="arrow_back"
      color="white"
      :to="{ name: 'admin' }"
    >
      <q-tooltip>Voltar ao Admin</q-tooltip>
    </q-btn>
  </div>
</template>

<script setup>
// Página protegida por auth - apenas exibe o dashboard HTML original
</script>

<style scoped>
.metrics-page {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: relative;
}

.metrics-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.back-btn {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
  background: rgba(0, 142, 193, 0.9);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.back-btn:hover {
  background: rgba(0, 142, 193, 1);
}
</style>
