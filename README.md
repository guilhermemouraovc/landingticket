# LandingTicket

> Plataforma web moderna para descobrir e reservar ingressos para os melhores eventos em Pernambuco. Desenvolvida com Quasar Framework (Vue 3) + Supabase, oferecendo experiência rápida e responsiva em dispositivos móveis e desktop.

## Quick Start

### Como instalar e rodar o projeto?

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/landingticket.git
cd landingticket

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais do Supabase

# Rodar em modo de desenvolvimento
npm run dev
```

Acesse: http://localhost:9000

### Como fazer o build para produção?

```bash
# Build para produção (SPA)
npm run build

# Build para SSR (Server Side Rendering)
npm run build:ssr

# Preview do build
npm run preview
```

## Funcionalidades Principais

### Como visualizar eventos disponíveis?

A página inicial exibe eventos em carrosséis organizados por data:

```vue
<!-- Exemplo de uso do EventCard -->
<template>
  <EventCard
    :event="eventData"
    @click="navigateToEvent"
  />
</template>

<script setup>
const eventData = {
  id: '123',
  title: 'Festival de São João',
  date: '23 JUN',
  location: 'Olinda - PE',
  cityState: 'Olinda - PE',
  image: 'https://...',
  price: 150.00,
  hasPrice: true
}

function navigateToEvent(event) {
  router.push(`/evento/${event.id}`)
}
</script>
```

### Como buscar eventos?

```javascript
// Usando o composable de busca
import { useEventSearch } from 'src/composables/useEventSearch'

const { searchEvents, searchResults, isLoading } = useEventSearch()

// Buscar por termo
await searchEvents('carnaval')

// Buscar por cidade
await searchEvents('Recife')

// Resultados em searchResults.value
console.log(searchResults.value) // Array de eventos
```

### Como integrar com Supabase?

```javascript
// src/boot/supabase.js já configura o cliente
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Usar em qualquer componente
import { supabase } from 'boot/supabase'

// Buscar eventos
const { data, error } = await supabase
  .from('events')
  .select('*')
  .eq('active', true)
```

## Configuração

### Como configurar variáveis de ambiente?

Crie um arquivo `.env` na raiz do projeto:

```bash
# Supabase Configuration
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anonima

# Optional: Google Analytics
GA_TRACKING_ID=UA-XXXXXXXXX-X

# Optional: API Base URL
API_BASE_URL=https://api.exemplo.com
```

### Como customizar o tema?

```javascript
// quasar.config.js
module.exports = {
  framework: {
    config: {
      brand: {
        primary: '#1976D2',
        secondary: '#26A69A',
        accent: '#9C27B0',
        // ... outras cores
      }
    }
  }
}
```

Ou use variáveis CSS:

```css
/* src/css/app.scss */
:root {
  --primary-color: #1976D2;
  --secondary-color: #26A69A;
}
```

## Componentes Principais

### EventCard

Componente para exibir cards de eventos:

```vue
<EventCard
  :event="eventData"
  :variant="'carousel'"
  :clickable="true"
  :show-price="true"
  @click="handleClick"
/>
```

**Props:**
- `event` (Object, obrigatório): Dados do evento
- `variant` (String): 'carousel' ou 'grid'
- `clickable` (Boolean): Se o card é clicável
- `showPrice` (Boolean): Mostrar preços

### EventSectionCarousel

Carrossel de eventos com título de seção:

```vue
<EventSectionCarousel
  title="Eventos de Hoje"
  :events="todayEvents"
  @event-click="navigateToDetail"
/>
```

## Casos de Uso Comuns

### Como adicionar um novo evento?

```javascript
// Usando o Supabase client
import { supabase } from 'boot/supabase'

async function createEvent(eventData) {
  const { data, error } = await supabase
    .from('events')
    .insert([
      {
        title: 'Novo Evento',
        description: 'Descrição do evento',
        date: '2025-06-23',
        location: 'Recife - PE',
        price: 150.00,
        image_url: 'https://...',
        active: true
      }
    ])
    .select()

  if (error) {
    console.error('Erro ao criar evento:', error)
    return null
  }

  return data[0]
}
```

### Como implementar navegação entre páginas?

```javascript
// Em um componente
import { useRouter } from 'vue-router'

const router = useRouter()

// Navegar para página de detalhes
function goToEventDetail(eventId) {
  router.push({
    name: 'event-detail',
    params: { id: eventId }
  })
}

// Navegar para página de busca com query
function searchEvents(term) {
  router.push({
    name: 'search',
    query: { q: term }
  })
}

// Voltar para página anterior
function goBack() {
  router.back()
}
```

### Como tratar erros de API?

```javascript
// Composable para tratamento de erros
export function useErrorHandler() {
  const $q = useQuasar()

  function handleError(error, customMessage = null) {
    console.error('Erro:', error)

    const message = customMessage ||
                   error.message ||
                   'Ocorreu um erro inesperado'

    $q.notify({
      type: 'negative',
      message: message,
      position: 'top',
      timeout: 3000
    })
  }

  return { handleError }
}

// Uso em componente
const { handleError } = useErrorHandler()

try {
  await loadEvents()
} catch (error) {
  handleError(error, 'Erro ao carregar eventos')
}
```

## Estrutura do Projeto

```
landingticket/
├── public/              # Arquivos estáticos e assets públicos
│   ├── ticketpe.svg    # Logo principal
│   ├── Vector.svg      # Ícones SVG
│   └── metrics-dashboard.html  # Dashboard de métricas
│
├── src/
│   ├── assets/         # Assets do projeto (imagens, fontes)
│   ├── boot/           # Boot files (axios, supabase, etc)
│   │   └── supabase.js # Configuração do Supabase
│   │
│   ├── components/     # Componentes Vue reutilizáveis
│   │   ├── EventCard.vue
│   │   ├── EventSectionCarousel.vue
│   │   └── ...
│   │
│   ├── composables/    # Composables (lógica reutilizável)
│   │   ├── useEventSearch.js
│   │   ├── useErrorHandler.js
│   │   └── ...
│   │
│   ├── constants/      # Constantes e configurações
│   │   └── config.js
│   │
│   ├── css/            # Estilos globais
│   │   └── app.scss
│   │
│   ├── layouts/        # Layouts das páginas
│   │   └── MainLayout.vue
│   │
│   ├── pages/          # Páginas da aplicação
│   │   ├── IndexPage.vue      # Página inicial
│   │   ├── EventDetailPage.vue # Detalhes do evento
│   │   └── ...
│   │
│   ├── router/         # Configuração de rotas
│   │   ├── index.js
│   │   └── routes.js
│   │
│   └── utils/          # Funções utilitárias
│       ├── supabaseEventMapper.js
│       └── ...
│
├── .env.example        # Exemplo de variáveis de ambiente
├── vercel.json         # Configuração de deploy na Vercel
├── quasar.config.js    # Configuração do Quasar Framework
└── package.json        # Dependências e scripts
```

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Roda em modo de desenvolvimento
npm run dev:ssr          # Roda com Server Side Rendering

# Build
npm run build            # Build para produção (SPA)
npm run build:ssr        # Build para SSR
npm run build:pwa        # Build como Progressive Web App

# Qualidade de Código
npm run lint             # Verifica código com ESLint
npm run format           # Formata código com Prettier

# Testes
npm run test             # Roda testes unitários
npm run test:e2e         # Roda testes end-to-end

# Preview
npm run preview          # Preview do build de produção
```

## Deploy

### Como fazer deploy na Vercel?

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer deploy
vercel

# Deploy para produção
vercel --prod
```

A configuração está em `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/spa",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

### Como configurar variáveis de ambiente na Vercel?

1. Acesse o dashboard da Vercel
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Adicione:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - Outras variáveis necessárias

## Requisitos

- **Node.js** 20+ (ou 22, 24, 26, 28)
- **npm** 6.13.4+ ou **yarn** 1.21.1+
- Conta no **Supabase** (para backend)

## Stack Tecnológico

- **[Quasar Framework](https://quasar.dev)** v2.18.5 - Framework Vue.js para aplicações responsivas
- **[Vue.js](https://vuejs.org)** 3.5.20 - Framework JavaScript progressivo
- **[Supabase](https://supabase.com)** - Backend as a Service (banco de dados, autenticação, storage)
- **[Vite](https://vitejs.dev)** - Build tool rápida
- **[Vue Router](https://router.vuejs.org)** 4.0.0 - Roteamento oficial do Vue
- **[Pinia](https://pinia.vuejs.org)** - Store/state management

## Recursos Avançados

### Como implementar cache de eventos?

```javascript
// Composable com cache
import { ref } from 'vue'

const eventCache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

export function useEventCache() {
  async function getCachedEvent(eventId) {
    const cached = eventCache.get(eventId)

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data
    }

    // Buscar do Supabase se não estiver em cache
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single()

    eventCache.set(eventId, {
      data,
      timestamp: Date.now()
    })

    return data
  }

  function clearCache() {
    eventCache.clear()
  }

  return { getCachedEvent, clearCache }
}
```

### Como adicionar meta tags para SEO?

```javascript
// Em qualquer página
import { useMeta } from 'quasar'

export default {
  setup() {
    useMeta({
      title: 'Festival de São João - LandingTicket',
      meta: {
        description: {
          name: 'description',
          content: 'Compre ingressos para o Festival de São João em Olinda'
        },
        ogTitle: {
          property: 'og:title',
          content: 'Festival de São João - LandingTicket'
        },
        ogImage: {
          property: 'og:image',
          content: 'https://exemplo.com/imagem.jpg'
        }
      }
    })
  }
}
```

## Solução de Problemas Comuns

### Erro: "Supabase client not initialized"

**Problema:** O cliente Supabase não foi configurado corretamente.

**Solução:**
```bash
# Verificar se as variáveis de ambiente estão definidas
cat .env

# Devem conter:
# SUPABASE_URL=https://...
# SUPABASE_ANON_KEY=eyJ...
```

### Erro de CORS ao chamar API

**Problema:** Política CORS bloqueando requisições.

**Solução:**
```javascript
// Configurar no Supabase Dashboard
// Settings → API → CORS Allowed Origins
// Adicionar: http://localhost:9000

// Ou configurar headers no axios
// src/boot/axios.js
export default boot(({ app }) => {
  api.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
})
```

### Build falha na Vercel

**Problema:** Erro durante o build na Vercel.

**Solução:**
```bash
# Verificar versão do Node.js no vercel.json
{
  "framework": "quasar",
  "buildCommand": "npm run build",
  "engines": {
    "node": "20.x"
  }
}

# Limpar cache da Vercel e fazer redeploy
```

## Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Autor

**Guilherme Mourão**

---

## Links Úteis

- [Documentação do Quasar](https://quasar.dev/start/pick-quasar-flavour)
- [Documentação do Vue 3](https://vuejs.org/guide/introduction.html)
- [Documentação do Supabase](https://supabase.com/docs)
- [Guia de Deploy na Vercel](https://vercel.com/docs)
