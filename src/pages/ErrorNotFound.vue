<template>
  <div class="error-404-page">
    <div class="error-container">
      <div class="error-icon-wrapper">
        <q-icon name="search_off" class="error-icon" />
        <div class="error-code">404</div>
      </div>

      <h1 class="error-title">Página não encontrada</h1>

      <p class="error-message">Oops! A página que você está procurando não existe ou foi movida.</p>

      <p class="error-hint">Verifique se o endereço está correto ou volte para a página inicial.</p>

      <div class="error-actions">
        <q-btn
          unelevated
          no-caps
          size="lg"
          label="Voltar para Início"
          icon="home"
          class="action-btn action-btn--primary"
          to="/"
        />
        <q-btn
          color="white"
          text-color="white"
          label="Ver Eventos"
          icon="event"
          outline
          no-caps
          size="lg"
          class="action-btn"
          to="/programacao"
        />
      </div>
      <div class="helpful-links">
        <div class="links-title">Páginas úteis:</div>
        <div class="links-list">
          <router-link to="/" class="link-item">
            <q-icon name="home" size="18px" />
            <span>Início</span>
          </router-link>
          <router-link to="/programacao" class="link-item">
            <q-icon name="event" size="18px" />
            <span>Programação Completa</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Decoração de fundo (opcional) -->
    <div class="background-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  console.warn('404 - Página não encontrada:', window.location.href)
})
</script>

<style scoped>
/* ==================== PÁGINA ==================== */
.error-404-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #2a3447 0%, #1a2332 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

/* ==================== CONTAINER ==================== */
.error-container {
  max-width: 600px;
  text-align: center;
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.03);
  padding: 60px 40px;
  border-radius: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.error-icon-wrapper {
  position: relative;
  margin: 0 auto 32px;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-icon {
  font-size: 120px;
  color: #35c7ee;
  opacity: 0.9;
  animation: float 3s ease-in-out infinite;
}

.error-code {
  position: absolute;
  font-size: 140px;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.05);
  line-height: 1;
  user-select: none;
  z-index: -1;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* ==================== TEXTOS ==================== */
.error-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 16px 0;
  line-height: 1.2;
}

.error-message {
  font-size: 1.125rem;
  color: #e5e7eb;
  margin: 0 0 12px 0;
  line-height: 1.6;
}

.error-hint {
  font-size: 1rem;
  color: #9ca3af;
  margin: 0 0 40px 0;
  line-height: 1.5;
}

/* ==================== AÇÕES ==================== */
.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 48px;
}

.action-btn {
  min-width: 180px;
  height: 52px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
}

.action-btn--primary {
  background-color: #35c7ee !important;
  color: #000000 !important;
}

.action-btn--primary:hover {
  background-color: #2bb3d4 !important;
}

/* ==================== LINKS ÚTEIS ==================== */
.helpful-links {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 32px;
  margin-top: 32px;
}

.links-title {
  font-size: 0.9rem;
  color: #9ca3af;
  margin-bottom: 16px;
  font-weight: 500;
}

.links-list {
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
}

.link-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #35c7ee;
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  padding: 8px 16px;
  border-radius: 8px;
}

.link-item:hover {
  background: rgba(53, 199, 238, 0.1);
  transform: translateX(4px);
}

/* ==================== DECORAÇÃO ==================== */
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(53, 199, 238, 0.15) 0%, transparent 70%);
  animation: pulse 4s ease-in-out infinite;
}

.circle-1 {
  width: 400px;
  height: 400px;
  top: -200px;
  right: -100px;
  animation-delay: 0s;
}

.circle-2 {
  width: 300px;
  height: 300px;
  bottom: -150px;
  left: -100px;
  animation-delay: 1.5s;
}

.circle-3 {
  width: 200px;
  height: 200px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 3s;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1);
  }
}

/* ==================== RESPONSIVIDADE ==================== */
@media (max-width: 768px) {
  .error-container {
    padding: 40px 24px;
  }

  .error-title {
    font-size: 2rem;
  }

  .error-message {
    font-size: 1rem;
  }
  .error-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }

  .error-icon-wrapper {
    width: 160px;
    height: 160px;
  }

  .error-icon {
    font-size: 100px;
  }

  .error-code {
    font-size: 120px;
  }

  .links-list {
    flex-direction: column;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .error-404-page {
    padding: 20px 16px;
  }

  .error-title {
    font-size: 1.75rem;
  }

  .error-code {
    font-size: 100px;
  }
}
</style>
