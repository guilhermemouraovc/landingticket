<template>
  <q-page class="quem-somos">
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
        <h2 class="content-title">Quem Somos</h2>

        <div class="content-text">
          <p>
            A Ticketpe é uma plataforma de vendas de ingressos criada para transformar a forma como
            o público se conecta com eventos. Nascemos em 2020, em meio à cena cultural
            independente, com um modelo inovador que uniu tecnologia, comunidade e confiança.
          </p>

          <p>
            Fomos pioneiros ao criar uma rede ativa de vendas via WhatsApp, o que nos permitiu
            alcançar resultados expressivos e construir uma base fiel de clientes. Hoje, somos mais
            do que um canal de distribuição — somos uma ponte entre produtores, artistas e o
            público, oferecendo experiências mais próximas, acessíveis e eficientes.
          </p>

          <p>
            Nosso crescimento foi impulsionado pela parceria com a <strong>Heppi</strong>, empresa com mais de 8 anos
            de atuação no setor de eventos e soluções financeiras. Através dessa união, estruturamos
            um ecossistema completo com especialistas, tecnologia própria e uma cultura baseada em
            transparência, inovação e resultados.
          </p>

          <p>
            Compra segura, experiência simples. Na Ticketpe, a experiência do cliente vem em
            primeiro lugar. Por isso, contamos com um sistema de vendas totalmente automatizado, com
            uma área de controle exclusiva e links personalizados para cada representante,
            garantindo:
          </p>

          <ul class="bullet-list">
            <li>
              Segurança em todo o processo de compra, desde a escolha até a entrega do ingresso;
            </li>
            <li>Transparência nas informações e nas transações;</li>
            <li>Agilidade no atendimento e suporte humano sempre disponível;</li>
            <li>
              Uma experiência fluída e intuitiva tanto para quem vende quanto para quem compra.
            </li>
          </ul>

          <p>Além disso, possuímos:</p>

          <ul class="bullet-list">
            <li>Mais de 100 grupos ativos de venda via WhatsApp;</li>
            <li>Uma comunidade com mais de 10 mil pessoas;</li>
            <li>Operação nacional com representantes em 15 estados do Brasil;</li>
            <li>Perfis detalhados de clientes para suporte estratégico às vendas.</li>
          </ul>

          <p>
            Na Ticketpe, acreditamos no poder das conexões. Por isso, investimos fortemente em
            nossos representantes, que atuam com dedicação e entrega, levando os ingressos e o
            prazer compartilhado e personalizado. Com inteligência de dados e uma estrutura digital
            em constante evolução, estamos prontos para oferecer aos ingressos — mas acesso
            facilitado, confiável e seguro aos melhores momentos da vida.
          </p>

          <p>Ticketpe. Conectando você aos melhores momentos.</p>
        </div>
      </div>
    </section>
  </q-page>
</template>

<script setup>
import BackButton from 'src/components/BackButton.vue'
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
  background-color: #1a202c;
  background-image: url('/logo.svg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
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

.hero-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.logo-image {
  width: 220px;
  height: auto;
  object-fit: contain;
  opacity: 0.7;
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

.bullet-list {
  list-style: disc;
  margin-left: 24px;
  margin-bottom: 20px;
  color: #d1d5db;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  line-height: 1.8;
}

.bullet-list li {
  margin-bottom: 12px;
}

.bullet-list li:last-child {
  margin-bottom: 0;
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
}
</style>
