# 🎯 Área Administrativa - LandingTicket

## 📦 O que foi implementado?

Uma área administrativa completa com autenticação Supabase onde administradores podem gerenciar eventos diretamente pelo site.

### ✨ Funcionalidades

- ✅ **Autenticação segura** com Supabase Auth
- ✅ **CRUD completo de eventos** (Criar, Ler, Atualizar, Deletar)
- ✅ **Gerenciamento de imagens** para eventos
- ✅ **Sistema de tags/categorias**
- ✅ **Informações de preço e parcelamento**
- ✅ **Eventos em destaque**
- ✅ **Busca e filtros** na lista de eventos
- ✅ **Visualização prévia** dos eventos no site
- ✅ **Interface responsiva** e intuitiva

---

## 🗂️ Arquivos Criados

### Composables

- `src/composables/useAuth.js` - Gerenciamento de autenticação
- `src/composables/useAdminEvents.js` - CRUD de eventos

### Páginas

- `src/pages/LoginPage.vue` - Tela de login
- `src/pages/AdminPage.vue` - Dashboard administrativo

### Componentes

- `src/components/EventForm.vue` - Formulário de criação/edição de eventos

### Documentação

- `SUPABASE_AUTH_SETUP.md` - Guia completo de configuração

---

## 🚀 Como Usar

### 1. Configurar Supabase

Siga o guia detalhado em: **`SUPABASE_AUTH_SETUP.md`**

Resumo rápido:

1. Habilitar Authentication no Supabase
2. Criar usuário admin com metadata:
   ```json
   {
     "role": "admin",
     "is_admin": true
   }
   ```
3. Configurar políticas RLS (script SQL fornecido)

### 2. Acessar a Área Admin

1. Iniciar o servidor:

   ```bash
   npm run dev
   ```

2. Acessar: `http://localhost:9000/#/login`

3. Fazer login com as credenciais do admin

4. Gerenciar eventos em: `http://localhost:9000/#/admin`

---

## 📋 Campos do Formulário de Eventos

### Informações Básicas

- **Título** (obrigatório)
- **Descrição**
- **Informações Adicionais**

### Data e Horário

- **Data de Início**
- **Data de Término**

### Localização

- **Local** (nome do estabelecimento)
- **Cidade**
- **Estado**

### Contato

- **WhatsApp** (com código do país)
- **Mensagem WhatsApp** (padrão)
- **Link de Compartilhamento**

### Preço

- **Preço do Ingresso**
- **Número de Parcelas**
- **Valor da Parcela**

### Configurações

- **Evento em Destaque** (toggle)
- **Categorias/Tags** (múltipla seleção)
- **Imagens** (com tipo: card/detail/both)

---

## 🔐 Segurança

### Row Level Security (RLS)

- ✅ **Leitura pública**: Qualquer pessoa pode ver eventos (site público funciona normalmente)
- ✅ **Escrita restrita**: Apenas admins autenticados podem criar/editar/deletar
- ✅ **Verificação de metadata**: Sistema verifica `is_admin` no JWT

### Fluxo de Autenticação

1. Usuário faz login com email/senha
2. Supabase valida credenciais
3. Sistema verifica metadata `is_admin`
4. Se não for admin, faz logout automaticamente
5. Se for admin, libera acesso ao `/admin`

### Navigation Guard

Proteção de rotas implementada no router:

- Tenta acessar `/admin` sem login → Redireciona para `/login`
- Tenta acessar `/admin` sem ser admin → Redireciona para `/`

---

## 🎨 Interface

### Dashboard Admin (`/admin`)

- **Header**: Botões para criar evento, voltar ao site e logout
- **Busca**: Campo de busca para filtrar eventos
- **Tabela**: Lista todos os eventos com:
  - Título
  - Data de início
  - Cidade
  - Status de destaque
  - Tags
  - Ações (Visualizar, Editar, Deletar)

### Formulário de Evento

- **Seções organizadas**: Informações básicas, datas, localização, preços, etc.
- **Validação**: Campos obrigatórios marcados
- **Hints**: Dicas em cada campo
- **Upload de múltiplas imagens**: Com tipo (card/detail/both)
- **Seleção de tags**: Múltipla seleção com chips

---

## 🔄 Fluxo de Dados

### Criar Evento

1. Admin preenche o formulário
2. `useAdminEvents.createEvent()` é chamado
3. Cria o evento na tabela `events`
4. Associa tags na tabela `event_tags`
5. Adiciona imagens na tabela `event_images`
6. Retorna para a lista atualizada

### Editar Evento

1. Admin clica em "Editar"
2. Modal abre com dados pré-preenchidos
3. Admin modifica campos desejados
4. `useAdminEvents.updateEvent()` é chamado
5. Atualiza evento
6. Remove tags antigas e adiciona novas
7. Gerencia imagens (adiciona novas, mantém existentes)
8. Retorna para a lista atualizada

### Deletar Evento

1. Admin clica em "Deletar"
2. Dialog de confirmação aparece
3. Se confirmar, `useAdminEvents.deleteEvent()` é chamado
4. Deleta imagens relacionadas
5. Deleta tags relacionadas
6. Deleta o evento
7. Lista é atualizada

---

## 📊 Estrutura do Banco de Dados

### Tabelas Utilizadas

- `events` - Dados principais dos eventos
- `event_tags` - Relacionamento eventos ↔ tags
- `event_images` - Imagens dos eventos
- `tags` - Categorias disponíveis

### Views Utilizadas (Leitura Pública)

- `view_event_cards` - Dados otimizados para cards
- `view_event_detail` - Dados completos para página de detalhes
- `view_events_by_tag` - Filtro por tag

---

## 🛠️ Tecnologias Utilizadas

- **Quasar Framework** - UI components e layout
- **Vue 3 Composition API** - Reatividade e composables
- **Supabase Auth** - Autenticação JWT
- **Supabase Database** - PostgreSQL com RLS
- **Vue Router** - Navegação e guards

---

## 📝 Próximas Melhorias (Opcionais)

1. **Upload de Imagens Direto**
   - Integrar Supabase Storage
   - Fazer upload de imagens pelo admin
   - Gerar URLs automaticamente

2. **Gerenciamento de Tags**
   - CRUD de tags/categorias
   - Criar novas categorias pelo admin

3. **Dashboard com Estatísticas**
   - Total de eventos
   - Eventos em destaque
   - Eventos por categoria
   - Gráficos

4. **Histórico de Alterações**
   - Log de quem criou/editou cada evento
   - Data/hora das modificações

5. **Múltiplos Níveis de Acesso**
   - Admin total
   - Editor (pode editar, mas não deletar)
   - Visualizador

6. **Preview do Evento**
   - Ver como ficará no site antes de publicar
   - Modo rascunho

---

## 🆘 Suporte

Se encontrar problemas:

1. Consulte `SUPABASE_AUTH_SETUP.md` - seção Troubleshooting
2. Verifique o console do navegador (F12)
3. Verifique os logs do Supabase Dashboard
4. Confirme que as políticas RLS estão ativas

---

## 🎉 Pronto!

Sua área administrativa está configurada e pronta para uso!

Acesse: `http://localhost:9000/#/login`
