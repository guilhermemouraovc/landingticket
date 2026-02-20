<template>
  <div class="saojoao-overlay" @click.self="$emit('close')">
    <div class="saojoao-modal">
      <!-- Bandeirinhas decorativas -->
      <div class="bandeirinhas" aria-hidden="true">
        <svg width="100%" height="60" viewBox="0 0 800 60" preserveAspectRatio="none">
          <line x1="0" y1="8" x2="800" y2="8" stroke="#f59e0b" stroke-width="2" />
          <polygon
            v-for="(flag, i) in flags"
            :key="i"
            :points="`${flag.x},8 ${flag.x + 20},8 ${flag.x + 10},38`"
            :fill="flag.color"
          />
        </svg>
      </div>

      <!-- Header temático -->
      <div class="sj-header">
        <div class="sj-title-row">
          <span class="sj-emoji">🎆</span>
          <h2 class="sj-title">CONTAGEM SÃO JOÃO</h2>
          <span class="sj-emoji">🎆</span>
        </div>
        <p class="sj-subtitle">Falta pouco!</p>

        <button class="sj-close-btn" @click="$emit('close')" aria-label="Fechar">✕</button>
      </div>

      <!-- Contador regressivo -->
      <div class="countdown-section">
        <div class="countdown-grid">
          <div class="countdown-unit">
            <div class="countdown-value">{{ timeLeft.days }}</div>
            <div class="countdown-label">DIAS</div>
          </div>
          <div class="countdown-sep">:</div>
          <div class="countdown-unit">
            <div class="countdown-value">{{ timeLeft.hours }}</div>
            <div class="countdown-label">HORAS</div>
          </div>
          <div class="countdown-sep">:</div>
          <div class="countdown-unit">
            <div class="countdown-value">{{ timeLeft.minutes }}</div>
            <div class="countdown-label">MIN</div>
          </div>
          <div class="countdown-sep">:</div>
          <div class="countdown-unit">
            <div class="countdown-value">{{ timeLeft.seconds }}</div>
            <div class="countdown-label">SEG</div>
          </div>
        </div>

        <div class="sj-date-info">
          <span class="sj-date-badge">📅 23 de Junho de 2026 — São João!</span>
        </div>
      </div>

      <!-- Fogueira animada -->
      <div class="firepit-container" aria-hidden="true">
        <div class="fire-sparks">
          <div class="spark" v-for="n in 12" :key="n"></div>
        </div>
        <div class="fire">
          <div class="flame"></div>
          <div class="flame"></div>
          <div class="flame"></div>
          <div class="flame"></div>
        </div>
        <div class="fire-log"></div>
      </div>

      <!-- Mensagem festiva -->
      <div class="sj-message">
        <div v-if="daysNumber > 60" class="sj-msg-text">🌽 O milho tá crescendo! 🌽</div>
        <div v-else-if="daysNumber > 30" class="sj-msg-text urgent">🌽 Menos de 2 meses! 🌽</div>
        <div v-else-if="daysNumber > 7" class="sj-msg-text urgent">🔥 Tá chegando!🔥</div>
        <div v-else-if="daysNumber > 0" class="sj-msg-text fire">⚡ SEMANA DO SÃO JOÃO! ⚡</div>
        <div v-else class="sj-msg-text arrived">🎉 É HOJE! VIVA SÃO JOÃO! 🎉</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

defineEmits(['close'])

const flagColors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#f97316']

const flags = computed(() =>
  Array.from({ length: 38 }, (_, i) => ({
    x: i * 21,
    color: flagColors[i % flagColors.length],
  })),
)

const now = ref(new Date())
let ticker = null

const targetDate = new Date('2026-06-23T00:00:00')

const daysNumber = computed(() => {
  const diff = targetDate - now.value
  if (diff <= 0) return 0
  return Math.floor(diff / (1000 * 60 * 60 * 24))
})

const timeLeft = computed(() => {
  const diff = targetDate - now.value
  if (diff <= 0) return { days: '00', hours: '00', minutes: '00', seconds: '00' }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return {
    days: String(days).padStart(3, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  }
})

onMounted(() => {
  ticker = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(ticker)
})
</script>

<style scoped>
/* ── Overlay ── */
.saojoao-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 22, 40, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
  backdrop-filter: blur(4px);
}

/* ── Modal ── */
.saojoao-modal {
  position: relative;
  background: linear-gradient(160deg, #1a0a00 0%, #2d1a00 40%, #1a0a00 100%);
  border: 2px solid #f59e0b;
  border-radius: 20px;
  width: 100%;
  max-width: 520px;
  overflow: hidden;
  box-shadow:
    0 0 60px rgba(245, 158, 11, 0.25),
    0 24px 48px rgba(0, 0, 0, 0.6);
  animation: modal-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.85) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* ── Bandeirinhas ── */
.bandeirinhas {
  display: block;
  line-height: 0;
}

/* ── Header ── */
.sj-header {
  padding: 20px 24px 16px;
  text-align: center;
  position: relative;
}

.sj-title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.sj-emoji {
  font-size: 24px;
}

.sj-title {
  font-family: 'Inter', sans-serif;
  font-size: 22px;
  font-weight: 900;
  color: #f59e0b;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin: 0;
  text-shadow: 0 0 20px rgba(245, 158, 11, 0.6);
}

.sj-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #fcd34d;
  margin: 8px 0 0;
  opacity: 0.9;
}

.sj-close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: #f59e0b;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  line-height: 1;
}

.sj-close-btn:hover {
  background: rgba(245, 158, 11, 0.3);
  transform: scale(1.1);
}

/* ── Contador ── */
.countdown-section {
  padding: 0 24px 16px;
}

.countdown-grid {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
}

.countdown-unit {
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 12px;
  padding: 12px 16px;
  text-align: center;
  min-width: 72px;
  box-shadow:
    inset 0 1px 0 rgba(245, 158, 11, 0.2),
    0 4px 12px rgba(0, 0, 0, 0.3);
}

.countdown-value {
  font-family: 'Inter', sans-serif;
  font-size: 40px;
  font-weight: 900;
  color: #fbbf24;
  line-height: 1;
  text-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
  letter-spacing: -1px;
}

.countdown-label {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 700;
  color: #f59e0b;
  letter-spacing: 2px;
  margin-top: 6px;
  opacity: 0.8;
}

.countdown-sep {
  font-size: 32px;
  font-weight: 900;
  color: #f59e0b;
  line-height: 1;
  margin-bottom: 20px;
  opacity: 0.7;
}

.sj-date-info {
  text-align: center;
}

.sj-date-badge {
  display: inline-block;
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.4);
  border-radius: 20px;
  padding: 6px 16px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #fcd34d;
  letter-spacing: 0.5px;
}

/* ── Fogueira ── */
.firepit-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  height: 110px;
  margin-bottom: 4px;
}

.fire-sparks {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 0;
}

.fire {
  position: absolute;
  bottom: 26px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 60px;
}

.flame {
  position: absolute;
  bottom: 0;
  left: 0;
  opacity: 0.9;
  width: 100%;
  height: 100%;
  border-bottom-right-radius: 70%;
  border-bottom-left-radius: 70%;
  border-top-left-radius: 70%;
  transform: rotate(-45deg) skew(-10deg, -10deg);
  background-color: rgb(255, 34, 0);
  background-image: linear-gradient(to top right, rgba(255, 34, 0, 0.9), rgba(255, 106, 0, 0.7));
  z-index: 1;
  animation-iteration-count: infinite;
  animation-fill-mode: forwards;
  animation-name: burn-left;
  animation-duration: 300ms;
}

.flame:nth-child(2) {
  animation-name: burn-right;
  animation-duration: 400ms;
  height: 80%;
  width: 80%;
  left: 10%;
  background-color: rgb(255, 106, 0);
  background-image: linear-gradient(to top right, rgba(255, 106, 0, 0.1), rgba(255, 200, 0, 0.1));
  z-index: 2;
}

.flame:nth-child(3) {
  height: 50%;
  width: 50%;
  left: 25%;
  background-image: linear-gradient(to top right, rgb(255, 200, 0), white);
  z-index: 3;
}

.flame:nth-child(4) {
  height: 30%;
  width: 30%;
  left: 35%;
  background-color: white;
  background-image: linear-gradient(to top right, rgba(255, 255, 255, 0.3), rgba(0, 55, 255, 0.9));
  opacity: 1;
  z-index: 4;
}

.fire-log {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 14px;
  background: linear-gradient(135deg, #78350f, #92400e, #78350f);
  border-radius: 7px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  z-index: 5;
}

.fire-log::before {
  content: '';
  position: absolute;
  top: 3px;
  left: 10px;
  right: 10px;
  height: 3px;
  background: rgba(255, 200, 0, 0.3);
  border-radius: 2px;
}

/* Sparks */
.spark {
  position: absolute;
  bottom: 0;
  left: 15%;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background-color: rgba(255, 106, 0, 0.4);
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.spark:nth-child(1) {
  animation: fly-up-1 6s 0.4s infinite linear;
  left: 15%;
}
.spark:nth-child(2) {
  animation: fly-up-2 8.4s 1s infinite linear;
  left: 30%;
}
.spark:nth-child(3) {
  animation: fly-up-1 8s 1.9s infinite linear;
  left: 55%;
}
.spark:nth-child(4) {
  animation: fly-up-2 7s 2.6s infinite linear;
  left: 88%;
}
.spark:nth-child(5) {
  animation: fly-up-1 7s 1.4s infinite linear;
  left: 22%;
}
.spark:nth-child(6) {
  animation: fly-up-2 6s 3.2s infinite linear;
  left: 61%;
}
.spark:nth-child(7) {
  animation: fly-up-1 5s 0.8s infinite linear;
  left: 64%;
}
.spark:nth-child(8) {
  animation: fly-up-2 6s 5s infinite linear;
  left: 19%;
}
.spark:nth-child(9) {
  animation: fly-up-1 6.8s 4s infinite linear;
  left: 22%;
}
.spark:nth-child(10) {
  animation: fly-up-2 6s 5.2s infinite linear;
  left: 61%;
}
.spark:nth-child(11) {
  animation: fly-up-1 8s 3.5s infinite linear;
  left: 81%;
}
.spark:nth-child(12) {
  animation: fly-up-2 6s 2s infinite linear;
  left: 85%;
}

/* ── Mensagem festiva ── */
.sj-message {
  padding: 0 24px 20px;
  text-align: center;
}

.sj-msg-text {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #fcd34d;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.25);
  border-radius: 10px;
  padding: 10px 16px;
  animation: pulse-glow 2s ease-in-out infinite;
}

.sj-msg-text.urgent {
  color: #fb923c;
  border-color: rgba(251, 146, 60, 0.3);
  background: rgba(251, 146, 60, 0.1);
}

.sj-msg-text.fire {
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.4);
  background: rgba(239, 68, 68, 0.1);
  animation: pulse-glow 0.8s ease-in-out infinite;
}

.sj-msg-text.arrived {
  color: #22c55e;
  border-color: rgba(34, 197, 94, 0.4);
  background: rgba(34, 197, 94, 0.1);
}

/* ── Keyframes ── */
@keyframes burn-left {
  0%,
  100% {
    transform: rotate(-45deg) skew(-10deg, -10deg) scale(1);
  }
  30%,
  60% {
    transform: rotate(-44deg) skew(-12deg, -12deg) scale(1.01);
  }
}

@keyframes burn-right {
  0%,
  100% {
    transform: rotate(-45deg) skew(-10deg, -10deg) scale(1);
  }
  30%,
  60% {
    transform: rotate(-46deg) skew(-6deg, -6deg) scale(1.01);
  }
}

@keyframes fly-up-1 {
  0% {
    transform: translate(0, 0);
    opacity: 1;
  }
  33% {
    transform: translate(12px, -70px);
  }
  66% {
    transform: translate(0, -140px);
    opacity: 0.6;
  }
  100% {
    transform: translate(6px, -200px);
    opacity: 0;
  }
}

@keyframes fly-up-2 {
  0% {
    transform: translate(0, 0);
    opacity: 1;
  }
  50% {
    transform: translate(-10px, -80px);
  }
  80% {
    transform: translate(-4px, -140px);
    opacity: 0.6;
  }
  100% {
    transform: translate(-6px, -160px);
    opacity: 0;
  }
}

@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 0 rgba(245, 158, 11, 0);
  }
  50% {
    box-shadow: 0 0 12px rgba(245, 158, 11, 0.25);
  }
}

/* ── Responsivo ── */
@media (max-width: 480px) {
  .sj-title {
    font-size: 18px;
    letter-spacing: 2px;
  }
  .countdown-unit {
    min-width: 58px;
    padding: 10px 10px;
  }
  .countdown-value {
    font-size: 32px;
  }
  .countdown-sep {
    font-size: 24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .flame,
  .spark,
  .sj-msg-text {
    animation: none;
  }
}
</style>
