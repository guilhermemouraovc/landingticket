# LandingTicket - Plataforma de Eventos em Pernambuco

Plataforma desenvolvida com Quasar Framework (Vue 3) para descobrir e reservar ingressos para os melhores eventos em Pernambuco.

## 🚀 Tecnologias

- **Quasar Framework** v2.18.5
- **Vue.js** 3.5.20
- **Supabase** - Backend e banco de dados
- **Vite** - Build tool
- **Vue Router** 4.0.0

## 📦 Instalação

### Pré-requisitos

- Node.js 20+ (ou 22, 24, 26, 28)
- npm 6.13.4+ ou yarn 1.21.1+

### Instalar dependências

```bash
npm install
# ou
yarn install
```

## 🛠️ Desenvolvimento

### Iniciar servidor de desenvolvimento

```bash
npm run dev
# ou
quasar dev
```

A aplicação estará disponível em `http://localhost:9000`

### Lint

```bash
npm run lint
# ou
yarn lint
```

### Formatação de código

```bash
npm run format
# ou
yarn format
```

## 🏗️ Build de Produção

### Build local

```bash
npm run build
```

O build será gerado em `dist/spa/`

### Testar build localmente

```bash
npx http-server dist/spa -p 8080
```

Acesse `http://localhost:8080`

## 🌍 Variáveis de Ambiente

O projeto requer as seguintes variáveis de ambiente:

### Desenvolvimento

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_KEY=sua_chave_anon_do_supabase
```

### Produção

Configure as variáveis de ambiente na Vercel (ou outra plataforma de deploy):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_KEY`

⚠️ **Importante**: Todas as variáveis devem usar o prefixo `VITE_` para serem acessíveis no frontend.

### Arquivo de exemplo

Um arquivo `.env.example` está disponível como referência. Copie para `.env` e preencha com seus valores:

```bash
cp .env.example .env
```

## 🚀 Deploy

### Deploy na Vercel

O projeto está configurado para deploy na Vercel. Consulte o guia completo em **[DEPLOY.md](./DEPLOY.md)**.

**Resumo rápido:**

1. Conecte seu repositório à Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

Para mais detalhes, veja [DEPLOY.md](./DEPLOY.md).

### Outras plataformas

O projeto pode ser deployado em qualquer plataforma que suporte Node.js e SPA:

- Netlify
- GitHub Pages (com ajustes)
- AWS S3 + CloudFront
- Outras plataformas estáticas

## 📁 Estrutura do Projeto

```
landingticket/
├── public/           # Arquivos estáticos
├── src/
│   ├── assets/      # Assets do projeto
│   ├── boot/        # Boot files (axios, etc)
│   ├── components/  # Componentes Vue
│   ├── composables/ # Composables (hooks)
│   ├── constants/   # Constantes e configurações
│   ├── css/         # Estilos globais
│   ├── layouts/     # Layouts
│   ├── pages/       # Páginas
│   ├── router/      # Rotas
│   └── utils/       # Utilitários
├── .env.example     # Exemplo de variáveis de ambiente
├── vercel.json      # Configuração da Vercel
├── quasar.config.js # Configuração do Quasar
└── package.json     # Dependências
```

## 🎯 Funcionalidades

- ✅ Listagem de eventos por categoria
- ✅ Busca de eventos
- ✅ Filtros por categoria/tags
- ✅ Página de detalhes do evento
- ✅ Eventos relacionados
- ✅ Integração com WhatsApp
- ✅ Compartilhamento de eventos
- ✅ SEO otimizado
- ✅ Responsivo (mobile-first)
- ✅ Acessibilidade (WCAG 2.1 AA)

## 📝 Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build de produção
npm run lint         # Executa ESLint
npm run format       # Formata código com Prettier
```

## 🔧 Configuração

### Quasar Config

O arquivo `quasar.config.js` contém todas as configurações do projeto, incluindo:

- Build optimizations
- Code splitting
- Minificação
- Configurações de Vite

### Vercel Config

O arquivo `vercel.json` contém configurações específicas para deploy na Vercel:

- Rewrites para SPA
- Headers de segurança
- Cache control
- Content Security Policy

## 📚 Documentação

- [Quasar Framework](https://quasar.dev)
- [Vue.js](https://vuejs.org)
- [Supabase](https://supabase.com/docs)
- [Vercel](https://vercel.com/docs)

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Guilherme Mourão**

---

Para instruções detalhadas de deploy, consulte [DEPLOY.md](./DEPLOY.md).
