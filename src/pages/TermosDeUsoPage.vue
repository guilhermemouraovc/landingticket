<template>
  <q-page class="bg-landing">
    <div class="legal-page-wrap">
      <!-- Header com título -->
      <PageHeader title="Termos de Uso" use-gradient />

      <!-- Breadcrumbs -->
      <BreadcrumbNav :crumbs="breadcrumbItems" />

      <!-- Conteúdo -->
      <div class="legal-content">
        <div class="last-updated">
          Última atualização: {{ lastUpdated }}
        </div>

        <section class="legal-section">
          <h2 class="legal-section-title">1. INTRODUÇÃO</h2>
          <p class="legal-text">
            Bem-vindo à Ticketpe! Estes Termos de Uso regulam o acesso e a utilização do nosso site e serviços de venda de ingressos. Ao utilizar nossa plataforma, você concorda com os termos abaixo. Caso não concorde, não utilize nossos serviços.
          </p>
        </section>

        <section class="legal-section">
          <h2 class="legal-section-title">2. DEFINIÇÕES</h2>
          <p class="legal-text">
            <strong>Usuário:</strong> Qualquer pessoa que acessa o site Ticketpe.
          </p>
          <p class="legal-text">
            <strong>Comprador:</strong> Usuário que adquire ingressos por meio da plataforma.
          </p>
          <p class="legal-text">
            <strong>Organizador:</strong> Responsável pela realização do evento.
          </p>
          <p class="legal-text">
            <strong>Ingressos:</strong> Direitos de acesso a eventos vendidos na plataforma.
          </p>
        </section>

        <section class="legal-section">
          <h2 class="legal-section-title">3. CADASTRO E CONTA DO USUÁRIO</h2>
          <p class="legal-text">
            3.1. Para efetuar compras, o usuário deve criar uma conta com informações verdadeiras e atualizadas.
          </p>
          <p class="legal-text">
            3.2. O usuário é responsável pela confidencialidade de seus dados de login e senha.
          </p>
          <p class="legal-text">
            3.3. A Ticketpe pode suspender ou excluir contas em caso de suspeita de fraude ou descumprimento destes termos.
          </p>
        </section>

        <section class="legal-section">
          <h2 class="legal-section-title">4. COMPRA DE INGRESSOS</h2>
          <p class="legal-text">
            4.1. A compra de ingressos está sujeita à disponibilidade e aprovação do pagamento.
          </p>
          <p class="legal-text">
            4.2. Após a confirmação do pagamento, o ingresso será disponibilizado ao usuário de forma digital.
          </p>
          <p class="legal-text">
            4.3. Os preços dos ingressos podem variar e estão sujeitos à política dos organizadores.
          </p>
        </section>

        <section class="legal-section">
          <h2 class="legal-section-title">5. CANCELAMENTO E REEMBOLSO</h2>
          <p class="legal-text">
            5.1. Não serão aceitos cancelamentos ou pedidos de estorno após a compra, salvo nos casos previstos em lei.
          </p>
          <p class="legal-text">
            5.2. Em caso de cancelamento do evento, o organizador será responsável pelo reembolso.
          </p>
        </section>

        <section class="legal-section">
          <h2 class="legal-section-title">6. RESPONSABILIDADE DO USUÁRIO</h2>
          <p class="legal-text">
            6.1. O usuário se compromete a utilizar a plataforma de forma legal e ética.
          </p>
          <p class="legal-text">
            6.2. A revenda de ingressos é permitida, independentemente de autorização prévia.
          </p>
          <p class="legal-text">
            6.3. O usuário é responsável pela veracidade das informações fornecidas no cadastro e compra.
          </p>
        </section>

        <section class="legal-section">
          <h2 class="legal-section-title">7. RESPONSABILIDADE DO TICKETS PE</h2>
          <p class="legal-text">
            7.1. A Ticketpe atua como intermediário entre o usuário e o organizador do evento.
          </p>
          <p class="legal-text">
            7.2. Não somos responsáveis pela realização, cancelamento, qualidade ou qualquer alteração no evento.
          </p>
          <p class="legal-text">
            7.3. Não garantimos disponibilidade contínua da plataforma, podendo ocorrer interrupções por manutenção ou falhas técnicas.
          </p>
        </section>

        <section class="legal-section">
          <h2 class="legal-section-title">8. PRIVACIDADE E PROTEÇÃO DE DADOS</h2>
          <p class="legal-text">
            8.1. Os dados pessoais dos usuários são coletados e tratados conforme nossa Política de Privacidade.
          </p>
          <p class="legal-text">
            8.2. Não compartilhamos informações pessoais com terceiros sem consentimento do usuário, exceto quando necessário para a execução dos serviços.
          </p>
        </section>

        <section class="legal-section">
          <h2 class="legal-section-title">9. MODIFICAÇÕES NOS TERMOS DE USO</h2>
          <p class="legal-text">
            9.1. A Ticketpe pode alterar estes termos a qualquer momento, sendo as mudanças comunicadas no site.
          </p>
          <p class="legal-text">
            9.2. O uso contínuo da plataforma após modificações significa a aceitação dos novos termos.
          </p>
        </section>

        <section class="legal-section">
          <h2 class="legal-section-title">10. DISPOSIÇÕES GERAIS</h2>
          <p class="legal-text">
            10.1. Caso qualquer cláusula destes Termos seja considerada inválida, as demais continuarão em vigor.
          </p>
          <p class="legal-text">
            10.2. O foro para resolução de quaisquer disputas é o da comarca de Recife - PE.
          </p>
        </section>

        <section class="legal-section">
          <h2 class="legal-section-title">CONTATO</h2>
          <p class="legal-text">
            Para dúvidas ou suporte, entre em contato pelo e-mail: 
            <a href="mailto:Ajuda@ticketpe.com.br" class="legal-link">Ajuda@ticketpe.com.br</a>
          </p>
        </section>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import BreadcrumbNav from 'src/components/BreadcrumbNav.vue'
import PageHeader from 'src/components/PageHeader.vue'

// Data da última atualização (formato brasileiro)
const lastUpdated = ref('11/02/2025')

// Breadcrumbs
const breadcrumbItems = ref([
  { label: 'Início', to: '/' },
  { label: 'Termos de Uso', to: null },
])

// Define o título da página
onMounted(() => {
  document.title = 'Termos de Uso | TicketPE'
})

onUnmounted(() => {
  document.title = 'TicketPE - Eventos em Pernambuco'
})
</script>

<style scoped lang="scss">
.legal-page-wrap {
  max-width: 900px;
  margin: 0 auto;
  padding-bottom: 80px;
}

/* Header agora é componente */
.legal-page-wrap :deep(.page-header) {
  margin-bottom: 24px;
}

.legal-page-wrap :deep(.page-header .back-button-container) {
  margin-bottom: 32px;
  margin-top: 24px;
}

.legal-page-wrap :deep(.page-title) {
  font-family: 'Poppins', sans-serif;
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 16px;
}

.legal-page-wrap :deep(.title-divider) {
  margin-bottom: 32px;
}

/* Conteúdo legal */
.legal-content {
  background-color: #455066;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.last-updated {
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  color: #FAFDFF;
  font-style: italic;
  margin-bottom: 32px;
  text-align: right;
  opacity: 0.8;
}

.legal-section {
  margin-bottom: 32px;
}

.legal-section:last-child {
  margin-bottom: 0;
}

.legal-section-title {
  font-family: 'Poppins', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #FAFDFF;
  margin-bottom: 16px;
}

.legal-text {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #FAFDFF;
  line-height: 1.7;
  margin-bottom: 16px;
}

.legal-text:last-child {
  margin-bottom: 0;
}

.legal-list {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  color: #FAFDFF;
  line-height: 1.7;
  margin-left: 24px;
  margin-bottom: 16px;
}

.legal-list li {
  margin-bottom: 8px;
}

.legal-link {
  color: #35c7ee;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.legal-link:hover {
  color: #008ec1;
  text-decoration: underline;
}

/* Mobile */
@media (max-width: 599px) {
  .legal-page-wrap {
    padding-bottom: 40px;
  }

  .page-title {
    font-size: 28px;
  }

  .legal-content {
    padding: 24px;
  }

  .legal-section-title {
    font-size: 20px;
  }

  .legal-text,
  .legal-list {
    font-size: 15px;
  }

  .last-updated {
    text-align: left;
    font-size: 13px;
  }
}

/* Tablet */
@media (min-width: 600px) and (max-width: 1023px) {
  .legal-content {
    padding: 32px;
  }
}
</style>

