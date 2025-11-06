<template>
  <q-page class="bg-landing">
    <div class="legal-page-wrap">
      <!-- Header com título -->
      <PageHeader title="Política de Privacidade" use-gradient />

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
            A privacidade dos visitantes do Ticketpe é uma prioridade.
          </p>
          <p class="legal-text">
            Esta Política de Privacidade explica de forma simples como lidamos com informações durante o uso do site.
          </p>
          <p class="legal-text">
            O Ticketpe não coleta, armazena ou processa dados pessoais de visitantes. Nosso objetivo é apenas fornecer informações sobre eventos e experiências culturais de forma transparente e segura.
          </p>
        </section>

        <section class="legal-section">
          <h2 class="legal-section-title">2. COLETA DE DADOS</h2>
          <p class="legal-text">
            O Ticketpe não solicita, armazena nem registra dados pessoais de nenhum tipo.
          </p>
          <p class="legal-text">
            Não há formulários de cadastro, login, compra, ou coleta de informações identificáveis (como nome, e-mail, telefone ou CPF).
          </p>
          <p class="legal-text">
            A navegação é totalmente livre e anônima.
          </p>
        </section>

        <section class="legal-section">
          <h2 class="legal-section-title">3. COOKIES E DADOS DE NAVEGAÇÃO</h2>
          <p class="legal-text">
            O Ticketpe não utiliza cookies para rastreamento, publicidade ou identificação de usuários.
          </p>
          <p class="legal-text">
            Podem ser usados apenas cookies técnicos necessários para o funcionamento básico do site (por exemplo, lembrar preferências de idioma ou exibir corretamente o conteúdo).
          </p>
          <p class="legal-text">
            Esses cookies não armazenam informações pessoais e podem ser desativados a qualquer momento no navegador.
          </p>
        </section>

        <section class="legal-section">
          <h2 class="legal-section-title">4. COMPARTILHAMENTO DE INFORMAÇÕES</h2>
          <p class="legal-text">
            O Ticketpe não compartilha nenhum tipo de dado com terceiros, parceiros, anunciantes ou plataformas externas.
          </p>
          <p class="legal-text">
            Como não há coleta de informações pessoais, não há dados a serem compartilhados.
          </p>
        </section>

        <section class="legal-section">
          <h2 class="legal-section-title">5. SEGURANÇA E ARMAZENAMENTO</h2>
          <p class="legal-text">
            Nosso site utiliza protocolos seguros (HTTPS) para proteger a navegação.
          </p>
          <p class="legal-text">
            Nenhum dado sensível é armazenado ou processado em nossos servidores.
          </p>
        </section>

        <section class="legal-section">
          <h2 class="legal-section-title">6. ALTERAÇÕES NA POLÍTICA</h2>
          <p class="legal-text">
            O Ticketpe pode atualizar esta Política de Privacidade para refletir melhorias no site ou mudanças legais.
          </p>
          <p class="legal-text">
            Recomendamos que os visitantes revisem periodicamente esta página para se manterem informados.
          </p>
        </section>

        <section class="legal-section">
          <h2 class="legal-section-title">7. CONTATO</h2>
          <p class="legal-text">
            Para dúvidas sobre esta Política de Privacidade ou sobre o funcionamento do site, entre em contato pelo e-mail:
          </p>
          <p class="legal-text">
            <a href="mailto:ajuda@ticketpe.com.br" class="legal-link">ajuda@ticketpe.com.br</a>
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
  { label: 'Política de Privacidade', to: null },
])

// Define o título da página
onMounted(() => {
  document.title = 'Política de Privacidade | TicketPE'
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

