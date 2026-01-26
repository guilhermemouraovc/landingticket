<template>
  <div class="metrics-dashboard" ref="dashboardRef">
    <div class="container">
      <div class="logo-container">
        <img src="/ticketpe.svg" alt="TicketPE" />
      </div>

      <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>

      <div class="header">
        <div class="header-top">
          <q-btn flat round icon="arrow_back" color="primary" :to="{ name: 'admin' }">
            <q-tooltip>Voltar ao Admin</q-tooltip>
          </q-btn>
          <h1>CARVA NA LADEIRA</h1>
          <button class="reload-btn" :class="{ loading: isLoading }" @click="reloadData">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Atualizar
          </button>
        </div>
        <div class="last-update">{{ lastUpdate }}</div>

        <div class="stats">
          <div class="stat-box">
            <div class="stat-label">Vendidos</div>
            <div class="stat-value">{{ formatNumber(stats.totalVendido) }}</div>
            <div class="stat-unit">de 700 INGRESSOS</div>
          </div>

          <div class="stat-box">
            <div class="stat-label">Disponíveis</div>
            <div class="stat-value">{{ formatNumber(stats.ingressosRestantes) }}</div>
            <div class="stat-unit">INGRESSOS</div>
          </div>

          <div class="stat-box green">
            <div class="stat-label">Receita Total</div>
            <div class="stat-value">{{ formatCurrency(lucros.total) }}</div>
            <div class="stat-unit"></div>
          </div>
        </div>

        <div class="meta-box">
          META DE RECEITA: <strong>{{ formatCurrency(meta.valor) }}</strong>
        </div>
      </div>

      <div class="progress-section">
        <h2>Progresso da Meta</h2>
        <div class="progress-bar-container">
          <div
            class="progress-bar-fill"
            :style="{ width: Math.max(progresso.percentual, 2) + '%' }"
          ></div>
          <span class="progress-percent-text">{{ progresso.percentual.toFixed(2) }}%</span>
        </div>
      </div>

      <div class="daily-section">
        <h2>Restantes por Dia</h2>
        <div class="daily-grid">
          <div v-for="day in dias" :key="day.nome" class="day-card">
            <div class="day-name">{{ day.nome }}</div>
            <div class="day-available">{{ formatNumber(day.disponiveis) }}</div>
            <div class="day-sold">{{ formatNumber(day.vendidoGeral) }} vendidos</div>

            <div v-if="day.lote1 || day.lote2 || day.lote3 || day.lote4" class="lotes-por-dia">
              <div v-if="day.lote1" class="lote-dia-item">
                <span class="lote-dia-nome">Lote 1</span>
                <div class="lote-dia-status">
                  <span class="vendido">{{ day.lote1.vendido }}</span>
                  <span class="meta">/ {{ day.lote1.meta }}</span>
                  <span :class="['badge', day.lote1.atingiuMeta ? 'atingiu' : 'falta']">
                    {{ day.lote1.atingiuMeta ? 'OK' : `-${day.lote1.restante}` }}
                  </span>
                </div>
              </div>
              <div v-if="day.lote2" class="lote-dia-item">
                <span class="lote-dia-nome">Lote 2</span>
                <div class="lote-dia-status">
                  <span class="vendido">{{ day.lote2.vendido }}</span>
                  <span class="meta">/ {{ day.lote2.meta }}</span>
                  <span :class="['badge', day.lote2.atingiuMeta ? 'atingiu' : 'falta']">
                    {{ day.lote2.atingiuMeta ? 'OK' : `-${day.lote2.restante}` }}
                  </span>
                </div>
              </div>
              <div v-if="day.lote3" class="lote-dia-item">
                <span class="lote-dia-nome">Lote 3</span>
                <div class="lote-dia-status">
                  <span class="vendido">{{ day.lote3.vendido }}</span>
                  <span class="meta">/ {{ day.lote3.meta }}</span>
                  <span :class="['badge', day.lote3.atingiuMeta ? 'atingiu' : 'falta']">
                    {{ day.lote3.atingiuMeta ? 'OK' : `-${day.lote3.restante}` }}
                  </span>
                </div>
              </div>
              <div v-if="day.lote4" class="lote-dia-item">
                <span class="lote-dia-nome">Lote 4/5</span>
                <div class="lote-dia-status">
                  <span class="vendido">{{ day.lote4.vendido }}</span>
                  <span class="meta">/ {{ day.lote4.meta }}</span>
                  <span :class="['badge', day.lote4.atingiuMeta ? 'atingiu' : 'falta']">
                    {{ day.lote4.atingiuMeta ? 'OK' : `-${day.lote4.restante}` }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lucros-section">
        <h2>Receita por Lote</h2>
        <div class="lucros-grid">
          <template v-for="lote in lotes" :key="lote.nome">
            <div v-if="lote.lucro > 0 || lote.totalVendido > 0" class="lucro-card">
              <div class="lucro-card-nome">{{ lote.nome }}</div>
              <div class="lucro-card-valor">{{ formatCurrency(lote.lucro) }}</div>
              <div v-if="lote.preco > 0" class="lucro-card-info">
                {{ formatNumber(lote.totalVendido) }} vendidos •
                {{ formatCurrency(lote.preco) }}/ingresso
              </div>
            </div>
          </template>

          <div v-if="lucros.total > 0" class="lucro-card total">
            <div class="lucro-card-nome">Total</div>
            <div class="lucro-card-valor">{{ formatCurrency(lucros.total) }}</div>
            <div class="lucro-card-info">
              {{ ((lucros.total / 290000) * 100).toFixed(2) }}% da meta
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const GOOGLE_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzh8ch_bDBx7WvohlHY945auJ3yBhbEZy_29O9F-Lj6HV-2r634w_HB_-IRDtx-Lp8W3g/exec'

const isLoading = ref(false)
const errorMessage = ref('')
const lastUpdate = ref('')

const stats = ref({ totalVendido: 0, ingressosRestantes: 700 })
const lucros = ref({ total: 0 })
const meta = ref({ valor: 290000 })
const progresso = ref({ percentual: 0 })
const dias = ref([])
const lotes = ref([])

let refreshInterval = null

function formatNumber(num) {
  return new Intl.NumberFormat('pt-BR').format(num || 0)
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0)
}

function updateLastUpdateTime() {
  const now = new Date()
  const timeStr = now.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  const dateStr = now.toLocaleDateString('pt-BR')
  lastUpdate.value = `Última atualização: ${dateStr} às ${timeStr}`
}

function reloadData() {
  fetchData()
}

async function fetchData() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    // Tentar primeiro com fetch
    try {
      const response = await fetch(GOOGLE_APPS_SCRIPT_URL)
      if (response.ok) {
        const data = await response.json()
        updateData(data)
        return
      }
    } catch (fetchError) {
      console.log('Fetch falhou, tentando JSONP...', fetchError)
    }

    // Fallback para JSONP
    await new Promise((resolve, reject) => {
      const script = document.createElement('script')
      const callbackName = 'jsonp_callback_' + Date.now()

      const timeout = setTimeout(() => {
        if (window[callbackName]) {
          delete window[callbackName]
          if (script.parentNode) {
            document.head.removeChild(script)
          }
          reject(new Error('Timeout ao carregar dados'))
        }
      }, 15000)

      window[callbackName] = function (data) {
        clearTimeout(timeout)
        updateData(data)
        delete window[callbackName]
        if (script.parentNode) {
          document.head.removeChild(script)
        }
        resolve()
      }

      script.onerror = function () {
        clearTimeout(timeout)
        delete window[callbackName]
        if (script.parentNode) {
          document.head.removeChild(script)
        }
        reject(new Error('Não foi possível conectar ao servidor'))
      }

      script.src = `${GOOGLE_APPS_SCRIPT_URL}?callback=${callbackName}`
      document.head.appendChild(script)
    })
  } catch (error) {
    console.error('Erro ao buscar dados:', error)
    errorMessage.value = 'Erro ao carregar dados: ' + error.message
  } finally {
    isLoading.value = false
  }
}

function updateData(data) {
  if (data.stats) {
    stats.value = data.stats
  }
  if (data.lucros) {
    lucros.value = data.lucros
  }
  if (data.meta) {
    meta.value = data.meta
  }
  if (data.progresso) {
    progresso.value = data.progresso
  }
  if (data.dias) {
    dias.value = data.dias
  }
  if (data.lotes) {
    lotes.value = data.lotes
  }
  updateLastUpdateTime()
}

onMounted(() => {
  fetchData()
  // Atualizar a cada 30 segundos
  refreshInterval = setInterval(fetchData, 30000)
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

.metrics-dashboard {
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  background: linear-gradient(135deg, #0a1628 0%, #1a365d 50%, #0d2137 100%);
  min-height: 100vh;
  padding: 12px;
}

.container {
  max-width: 1800px;
  margin: 0 auto;
}

.logo-container {
  text-align: center;
  margin-bottom: 12px;
}

.logo-container img {
  height: 50px;
  opacity: 0.9;
}

.header {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

h1 {
  color: #1a365d;
  font-size: 28px;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 4px;
  font-weight: 800;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 12px;
}

@media (max-width: 768px) {
  .stats {
    grid-template-columns: 1fr;
  }
}

.stat-box {
  background: linear-gradient(135deg, #008ec1 0%, #45c0e7 100%);
  border-radius: 12px;
  padding: 16px;
  color: white;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 142, 193, 0.3);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.stat-box:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0, 142, 193, 0.4);
}

.stat-box.green {
  background: linear-gradient(135deg, #059669 0%, #34d399 100%);
  box-shadow: 0 4px 20px rgba(5, 150, 105, 0.3);
}

.stat-box.green:hover {
  box-shadow: 0 8px 30px rgba(5, 150, 105, 0.4);
}

.stat-label {
  font-size: 12px;
  opacity: 0.9;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 600;
}

.stat-value {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 4px;
}

.stat-unit {
  font-size: 14px;
  opacity: 0.85;
  font-weight: 600;
  letter-spacing: 1px;
}

.meta-box {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 10px;
  padding: 12px;
  margin-top: 12px;
  text-align: center;
  font-size: 14px;
  color: #1a365d;
  font-weight: 500;
  border: 1px solid #e2e8f0;
}

.meta-box strong {
  font-size: 22px;
  color: #008ec1;
  font-weight: 700;
}

.progress-section {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  padding: 16px 24px;
  margin-bottom: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.progress-section h2 {
  color: #1a365d;
  font-size: 14px;
  margin-bottom: 12px;
  text-align: center;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.progress-bar-container {
  background: #e2e8f0;
  height: 36px;
  border-radius: 18px;
  overflow: visible;
  margin-bottom: 0;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0;
  position: relative;
}

.progress-bar-fill {
  background: linear-gradient(90deg, #008ec1 0%, #45c0e7 100%);
  height: 100%;
  min-width: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 12px;
  color: white;
  font-weight: 700;
  font-size: 14px;
  transition: width 0.5s ease;
  border-radius: 18px;
  box-shadow: 0 2px 10px rgba(0, 142, 193, 0.4);
}

.progress-percent-text {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-weight: 700;
  font-size: 14px;
  color: #1a365d;
}

.error-message {
  background: #ff4444;
  color: white;
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
  text-align: center;
}

.daily-section {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 12px;
}

.daily-section h2 {
  color: #1a365d;
  font-size: 14px;
  margin-bottom: 16px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
}

.daily-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

@media (max-width: 900px) {
  .daily-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 500px) {
  .daily-grid {
    grid-template-columns: 1fr;
  }
}

.day-card {
  background: linear-gradient(135deg, #008ec1 0%, #45c0e7 100%);
  border-radius: 12px;
  padding: 16px;
  color: white;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 142, 193, 0.3);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.day-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(0, 142, 193, 0.4);
}

.day-name {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 2px;
  opacity: 0.9;
}

.day-available {
  font-size: 32px;
  font-weight: 800;
  background: rgba(255, 255, 255, 0.15);
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 10px;
}

.day-sold {
  font-size: 13px;
  opacity: 0.9;
}

.lotes-por-dia {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.lote-dia-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  margin-bottom: 6px;
  font-size: 11px;
}

.lote-dia-item:last-child {
  margin-bottom: 0;
}

.lote-dia-nome {
  font-weight: 600;
}

.lote-dia-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.lote-dia-status .vendido {
  font-weight: 700;
}

.lote-dia-status .meta {
  opacity: 0.7;
}

.badge {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 700;
}

.badge.atingiu {
  background: #34d399;
  color: #064e3b;
}

.badge.falta {
  background: #fbbf24;
  color: #78350f;
}

.lucros-section {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.lucros-section h2 {
  color: #1a365d;
  font-size: 14px;
  margin-bottom: 16px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
}

.lucros-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.lucro-card {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-left: 4px solid #008ec1;
  border-radius: 10px;
  padding: 14px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.lucro-card.total {
  background: linear-gradient(135deg, #059669 0%, #34d399 100%);
  border-left: none;
  color: white;
}

.lucro-card-nome {
  font-size: 12px;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.lucro-card.total .lucro-card-nome {
  color: white;
  opacity: 0.9;
}

.lucro-card-valor {
  font-size: 20px;
  font-weight: 800;
  color: #008ec1;
}

.lucro-card.total .lucro-card-valor {
  color: white;
  font-size: 22px;
}

.lucro-card-info {
  font-size: 11px;
  color: #64748b;
  margin-top: 8px;
}

.lucro-card.total .lucro-card-info {
  color: rgba(255, 255, 255, 0.8);
}

.reload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #008ec1 0%, #45c0e7 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 142, 193, 0.3);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.reload-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 142, 193, 0.4);
}

.reload-btn:active {
  transform: translateY(0);
}

.reload-btn.loading {
  opacity: 0.7;
  pointer-events: none;
}

.reload-btn svg {
  width: 18px;
  height: 18px;
  transition: transform 0.3s ease;
}

.reload-btn.loading svg {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.header-top h1 {
  margin-bottom: 0;
}

.last-update {
  font-size: 12px;
  color: #64748b;
  margin-top: 8px;
}

@media (max-width: 768px) {
  .header-top {
    flex-direction: column;
    gap: 12px;
  }

  .header-top h1 {
    font-size: 20px;
    letter-spacing: 2px;
    order: -1;
  }
}
</style>
