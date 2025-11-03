<template>
  <q-page class="bg-landing">
    <div class="legal-page-wrap">
      <!-- Header com título -->
      <div class="page-header">
        <div class="back-button-container" @click="goBack">
          <div class="back-icon">
            <q-icon name="arrow_back" size="24px" class="back-arrow-icon" />
          </div>
          <span class="back-text">Voltar</span>
        </div>

        <!-- Título centralizado -->
        <div class="page-title">Termos de Uso</div>

        <!-- Linha divisória -->
        <div class="title-divider"></div>
      </div>

      <!-- Breadcrumbs -->
      <BreadcrumbNav :crumbs="breadcrumbItems" />

      <!-- Conteúdo -->
      <div class="legal-content">
        <div class="last-updated">
          Última atualização: {{ lastUpdated }}
        </div>

        <section class="legal-section">
          <h2 class="legal-section-title">1. Aceitação dos Termos</h2>
          <p class="legal-text">
            Ao acessar e utilizar o site TicketPE, você concorda em cumprir e estar vinculado aos seguintes Termos de Uso. 
            Se você não concorda com qualquer parte destes termos, não deve utilizar este site.
          </p>
        </section>

        <section class="legal-section">
          <h2 class="legal-section-title">2. Descrição do Serviço</h2>
          <p class="legal-text">
            O TicketPE é uma plataforma digital que disponibiliza informações sobre eventos culturais, shows, festivais e 
            outras atividades recreativas realizadas em Pernambuco. Nosso objetivo é facilitar o acesso dos usuários a 
            informações atualizadas sobre eventos locais.
          </p>
        </section>

        <section class="legal-section">
          <h2 class="legal-section-title">3. Uso do Site</h2>
          <p class="legal-text">
            Você concorda em utilizar o TicketPE apenas para fins legais e de maneira que não viole os direitos de terceiros 
            ou restrinja ou iniba o uso deste site por terceiros. É proibido:
          </p>
          <ul class="legal-list">
            <li>Utilizar o site de forma fraudulenta ou enganosa;</li>
            <li>Reproduzir, duplicar, copiar ou vender qualquer parte do site sem autorização prévia;</li>
            <li>Realizar engenharia reversa ou tentar extrair o código-fonte do site;</li>
            <li>Transmitir qualquer vírus, malware ou código malicioso;</li>
            <li>Utilizar robôs, spiders ou outros métodos automatizados para acessar o site sem autorização.</li>
          </ul>
        </section>

        <section class="legal-section">
          <h2 class="legal-section-title">4. Informações de Eventos</h2>
          <p class="legal-text">
            Embora nos esforcemos para manter as informações sobre eventos precisas e atualizadas, não garantimos a 
            exatidão, completude ou atualidade de todas as informações exibidas. Os organizadores dos eventos são 
            responsáveis pelas informações fornecidas sobre seus eventos.
          </p>
          <p class="legal-text">
            O TicketPE não se responsabiliza por alterações, cancelamentos ou modificações em eventos que sejam 
            comunicadas pelos organizadores após a publicação inicial.
          </p>
        </section>

        <section class="legal-section">
          <h2 class="legal-section-title">5. Links para Terceiros</h2>
          <p class="legal-text">
            O TicketPE pode conter links para sites de terceiros, incluindo plataformas de venda de ingressos, redes sociais 
            e sites dos organizadores dos eventos. Não nos responsabilizamos pelo conteúdo, políticas de privacidade ou 
            práticas de sites de terceiros. Recomendamos que você leia os termos de uso e políticas de privacidade de 
            qualquer site de terceiro que visitar.
          </p>
        </section>

        <section class="legal-section">
          <h2 class="legal-section-title">6. Propriedade Intelectual</h2>
          <p class="legal-text">
            Todo o conteúdo do TicketPE, incluindo textos, gráficos, logotipos, ícones, imagens, áudios, downloads digitais 
            e compilações de dados, é propriedade do TicketPE ou de seus fornecedores de conteúdo e está protegido pelas 
            leis brasileiras e internacionais de direitos autorais e propriedade intelectual.
          </p>
        </section>

        <section class="legal-section">
          <h2 class="legal-section-title">7. Limitação de Responsabilidade</h2>
          <p class="legal-text">
            O TicketPE é fornecido "como está" e "conforme disponível". Não garantimos que o site funcionará sem 
            interrupções ou erros, ou que quaisquer defeitos serão corrigidos. Não nos responsabilizamos por quaisquer 
            danos diretos, indiretos, incidentais, especiais ou consequenciais decorrentes do uso ou da incapacidade de 
            usar o site.
          </p>
        </section>

        <section class="legal-section">
          <h2 class="legal-section-title">8. Modificações nos Termos</h2>
          <p class="legal-text">
            Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As alterações entrarão em vigor 
            imediatamente após a publicação no site. O uso continuado do site após tais modificações constitui sua aceitação 
            dos novos termos. Recomendamos que você revise periodicamente esta página para estar ciente de quaisquer alterações.
          </p>
        </section>

        <section class="legal-section">
          <h2 class="legal-section-title">9. Lei Aplicável</h2>
          <p class="legal-text">
            Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Qualquer disputa relacionada a 
            estes termos será submetida à jurisdição exclusiva dos tribunais competentes de Pernambuco, Brasil.
          </p>
        </section>

        <section class="legal-section">
          <h2 class="legal-section-title">10. Contato</h2>
          <p class="legal-text">
            Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco através do e-mail: 
            <a href="mailto:ajuda@ticketpe.com.br" class="legal-link">ajuda@ticketpe.com.br</a>
          </p>
        </section>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import BreadcrumbNav from 'src/components/BreadcrumbNav.vue'

const router = useRouter()

// Data da última atualização (formato brasileiro)
const lastUpdated = ref('15 de janeiro de 2025')

// Breadcrumbs
const breadcrumbItems = ref([
  { label: 'Início', to: '/' },
  { label: 'Termos de Uso', to: null },
])

// Função para voltar
function goBack() {
  router.back()
}

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

/* Header */
.page-header {
  margin-bottom: 24px;
}

.back-button-container {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-bottom: 24px;
  width: fit-content;
  transition: opacity 0.2s ease;
  color: white;
}

.back-button-container:hover {
  opacity: 0.8;
}

.back-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  transition: background-color 0.2s ease;
}

.back-button-container:hover .back-icon {
  background-color: rgba(255, 255, 255, 0.2);
}

.back-arrow-icon {
  color: white;
}

.back-text {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: white;
}

.page-title {
  font-family: 'Poppins', sans-serif;
  font-size: 36px;
  font-weight: 700;
  color: white;
  text-align: center;
  margin-bottom: 16px;
}

.title-divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 20%,
    rgba(255, 255, 255, 0.3) 80%,
    transparent 100%
  );
  margin-bottom: 32px;
}

/* Conteúdo legal */
.legal-content {
  background-color: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.last-updated {
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  color: #6b7280;
  font-style: italic;
  margin-bottom: 32px;
  text-align: right;
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
  color: #1f2937;
  margin-bottom: 16px;
}

.legal-text {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #374151;
  line-height: 1.7;
  margin-bottom: 16px;
}

.legal-text:last-child {
  margin-bottom: 0;
}

.legal-list {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  color: #374151;
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

