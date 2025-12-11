<template>
  <q-page class="embaixadores-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-toolbar">
          <BackButton />
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="content-section">
      <div class="content-container">
        <h2 class="content-title">
          Transforme sua influência em benefício. Seja um Embaixador Ticketpe!
        </h2>

        <div class="content-text">
          <p>
            Já pensou numa realidade onde ter influência, uma boa rede de amigos e estar presente em
            todos os eventos pode te retornar grana?
          </p>

          <p>Veja o que fazer para começar.</p>

          <p>
            Você só precisa captar um possível comprador, claro, alguém que goste de festa tanto
            quanto você ou que esteja buscando melhores condições de compra - as quais só a Ticketpe
            pode oferecer!
          </p>

          <p>E quais são as condições, Ticketpe?</p>
          <p>
            Ingressos sem taxa, em até 12x no cartão e o MELHOR, sem juros, além de brindes
            exclusivos e poder participar da comunidade Ticketpe!
          </p>

          <p>Você indica, a gente recompensa. Simples assim.</p>

          <p>Preencha o formulário e deixa o resto com a gente!</p>
        </div>
      </div>
    </section>

    <!-- Form Section -->
    <section class="form-section">
      <div class="form-container">
        <h2 class="form-section-title">Faça Parte do Time!</h2>

        <q-card class="form-card">
          <q-card-section>
            <h3 class="form-title">Preencha o Formulário</h3>
            <p class="form-subtitle">
              Chegou a hora de preencher o formulário com sua informações e logo nosso time entra em
              ação para analisar tudo isso! Aguarde pelo nosso contato em breve.
            </p>

            <q-form @submit.prevent="onSubmit" class="form-fields">
              <q-input
                v-model="form.nomeCompleto"
                label="Nome Completo"
                outlined
                :rules="[(val) => !!val || 'Nome é obrigatório']"
                lazy-rules
              />

              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="form.email"
                    label="Email"
                    type="email"
                    outlined
                    :rules="[
                      (val) => !!val || 'Email é obrigatório',
                      (val) => isValidEmail(val) || 'Email inválido',
                    ]"
                    lazy-rules
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="form.telefone"
                    label="Telefone"
                    outlined
                    mask="(##) #####-####"
                    :rules="[(val) => !!val || 'Telefone é obrigatório']"
                    lazy-rules
                  />
                </div>
              </div>

              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="form.cidade"
                    label="Cidade"
                    outlined
                    :rules="[(val) => !!val || 'Cidade é obrigatória']"
                    lazy-rules
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="form.estado"
                    label="Estado"
                    outlined
                    :rules="[(val) => !!val || 'Estado é obrigatório']"
                    lazy-rules
                  />
                </div>
              </div>

              <q-input
                v-model="form.instagram"
                label="Perfil no Instagram"
                outlined
                prefix="@"
                :rules="[(val) => !!val || 'Instagram é obrigatório']"
                lazy-rules
              />

              <q-btn
                type="submit"
                label="ENVIAR"
                class="submit-btn full-width"
                :loading="loading"
                unelevated
                no-caps
              />
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </section>
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useQuasar } from 'quasar'
import BackButton from 'src/components/BackButton.vue'
import { supabase } from 'src/utils/supabase'

const $q = useQuasar()

const loading = ref(false)

const form = reactive({
  nomeCompleto: '',
  email: '',
  telefone: '',
  cidade: '',
  estado: '',
  instagram: '',
})

function isValidEmail(val) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(val)
}

async function onSubmit() {
  loading.value = true

  try {
    // Insere os dados na tabela de embaixadores no Supabase
    const { error } = await supabase.from('embaixadores').insert([
      {
        nome_completo: form.nomeCompleto,
        email: form.email,
        telefone: form.telefone,
        cidade: form.cidade,
        estado: form.estado,
        instagram: form.instagram,
      },
    ])

    if (error) {
      throw error
    }

    $q.notify({
      type: 'positive',
      message: 'Cadastro enviado com sucesso!',
      caption: 'Em breve entraremos em contato.',
      position: 'top',
      timeout: 5000,
      icon: 'check_circle',
    })

    // Limpa o formulário
    Object.keys(form).forEach((key) => {
      form[key] = ''
    })
  } catch (error) {
    console.error('Erro ao enviar cadastro:', error)
    $q.notify({
      type: 'negative',
      message: 'Erro ao enviar cadastro',
      caption: 'Por favor, tente novamente.',
      position: 'top',
      timeout: 5000,
      icon: 'error',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* ==================== PÁGINA BASE ==================== */
.embaixadores-page {
  background-color: #2a3447;
  min-height: 100vh;
}

/* ==================== HERO SECTION ==================== */
.hero-section {
  position: relative;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  height: 350px;
  background-image: url('/Rectangle 115.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(22, 31, 47, 0.6) 0%, rgba(22, 31, 47, 0.8) 100%);
}

.hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px 80px;
  width: 100%;
  box-sizing: border-box;
}

.hero-toolbar {
  display: flex;
  align-items: center;
}

/* ==================== CONTENT SECTION ==================== */
.content-section {
  padding: 60px 80px;
}

.content-container {
  max-width: 900px;
  margin: 0 auto;
}

.content-title {
  font-family: 'Poppins', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin: 0 0 32px 0;
  line-height: 1.4;
}

.content-text {
  color: #d1d5db;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  line-height: 1.8;
}

.content-text p {
  margin-bottom: 20px;
}

.content-text p:last-child {
  margin-bottom: 0;
}

/* ==================== FORM SECTION ==================== */
.form-section {
  padding: 0 80px 80px;
}

.form-container {
  max-width: 700px;
  margin: 0 auto;
}

.form-section-title {
  font-family: 'Poppins', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin: 0 0 32px 0;
}

.form-card {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.form-card .q-card__section {
  padding: 40px;
}

.form-title {
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.form-subtitle {
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 32px 0;
  line-height: 1.6;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-fields :deep(.q-field__control) {
  border-radius: 8px;
}

.form-fields :deep(.q-field--outlined .q-field__control:before) {
  border-color: #e5e7eb;
}

.form-fields :deep(.q-field--outlined .q-field__control:hover:before) {
  border-color: #35c7ee;
}

.form-fields :deep(.q-field--focused .q-field__control:before) {
  border-color: #35c7ee !important;
}

.form-fields :deep(.q-field__label) {
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  color: #6b7280;
}

.submit-btn {
  margin-top: 16px;
  height: 52px;
  background: linear-gradient(90deg, #008ec1 0%, #35c7ee 100%) !important;
  color: white !important;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 1px;
  border-radius: 8px;
}

.submit-btn:hover {
  background: linear-gradient(90deg, #007aa8 0%, #2ab5d9 100%) !important;
}

/* ==================== RESPONSIVIDADE ==================== */

/* Tablet */
@media (max-width: 1023px) {
  .hero-content {
    padding: 32px 40px;
  }

  .content-section {
    padding: 48px 40px;
  }

  .form-section {
    padding: 0 40px 60px;
  }
}

/* Mobile */
@media (max-width: 599px) {
  .hero-section {
    height: 300px;
  }

  .hero-content {
    padding: 24px 16px;
  }

  .content-section {
    padding: 40px 16px;
  }

  .content-title {
    font-size: 20px;
  }

  .content-text {
    font-size: 15px;
  }

  .form-section {
    padding: 0 16px 48px;
  }

  .form-section-title {
    font-size: 24px;
  }

  .form-card .q-card__section {
    padding: 24px 20px;
  }

  .form-title {
    font-size: 18px;
  }

  .form-subtitle {
    font-size: 13px;
  }
}
</style>


