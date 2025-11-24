# ✅ Checklist: Configuração Supabase para Área Admin

Siga esta lista passo a passo para configurar a autenticação e área administrativa.

---

## 📋 Parte 1: Habilitar Autenticação

### ☐ 1. Acessar o Supabase Dashboard
- [ ] Acesse [https://supabase.com](https://supabase.com)
- [ ] Faça login na sua conta
- [ ] Selecione o projeto **LandingTicket**

### ☐ 2. Habilitar Email Authentication
- [ ] No menu lateral, clique em **Authentication**
- [ ] Vá para a aba **Providers**
- [ ] Verifique se **Email** está com status **Enabled**
- [ ] Se não estiver, clique em **Email** e habilite

---

## 👤 Parte 2: Criar Usuário Administrador

### ☐ 3. Criar o Usuário
- [ ] Clique em **Authentication** > **Users**
- [ ] Clique no botão **Add user** ou **Invite**
- [ ] Escolha **Create new user**
- [ ] Preencha:
  - **Email**: `seu-email@exemplo.com`
  - **Password**: (crie uma senha forte)
  - **Auto Confirm User**: Marque como **Yes**
- [ ] Clique em **Create user**

### ☐ 4. Adicionar Metadata de Admin
- [ ] Na lista de usuários, clique no usuário criado
- [ ] Role até **User Metadata**
- [ ] Clique em **Edit** (ícone de lápis)
- [ ] Cole este JSON:
```json
{
  "role": "admin",
  "is_admin": true
}
```
- [ ] Clique em **Save**

---

## 🔐 Parte 3: Configurar Políticas RLS

### ☐ 5. Executar Script SQL
- [ ] No menu lateral, clique em **SQL Editor**
- [ ] Clique em **New query**
- [ ] Abra o arquivo `supabase_rls_policies.sql` do projeto
- [ ] Copie **TODO** o conteúdo do arquivo
- [ ] Cole no SQL Editor
- [ ] Clique em **Run** (ou pressione `Ctrl+Enter`)
- [ ] Aguarde a mensagem de sucesso

### ☐ 6. Verificar Políticas Criadas
- [ ] No mesmo SQL Editor, execute esta query:
```sql
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, cmd;
```
- [ ] Verifique se aparecem 16 políticas no total:
  - 4 para `events` (SELECT, INSERT, UPDATE, DELETE)
  - 4 para `event_images`
  - 4 para `event_tags`
  - 4 para `tags`

---

## 🧪 Parte 4: Testar a Implementação

### ☐ 7. Iniciar o Servidor Local
- [ ] No terminal, execute:
```bash
npm run dev
```
- [ ] Aguarde o servidor iniciar em `http://localhost:9000`

### ☐ 8. Testar Login
- [ ] Acesse: `http://localhost:9000/#/login`
- [ ] Digite o email e senha do admin
- [ ] Clique em **Entrar**
- [ ] Verifique se foi redirecionado para `/admin`
- [ ] Deve aparecer a lista de eventos (pode estar vazia)

### ☐ 9. Testar Criação de Evento
- [ ] Clique em **Novo Evento**
- [ ] Preencha pelo menos o campo **Título**
- [ ] Clique em **Salvar Evento**
- [ ] Verifique se o evento aparece na lista

### ☐ 10. Testar Edição de Evento
- [ ] Clique no ícone de **editar** (lápis) no evento criado
- [ ] Modifique algum campo
- [ ] Clique em **Salvar Evento**
- [ ] Verifique se as alterações foram salvas

### ☐ 11. Testar Visualização no Site
- [ ] Clique no ícone de **visualizar** (olho)
- [ ] Uma nova aba deve abrir mostrando o evento no site público
- [ ] Verifique se as informações estão corretas

### ☐ 12. Testar Deleção de Evento (Opcional)
- [ ] Clique no ícone de **deletar** (lixeira)
- [ ] Confirme a exclusão
- [ ] Verifique se o evento foi removido

### ☐ 13. Testar Logout
- [ ] Clique em **Sair** no canto superior direito
- [ ] Verifique se foi redirecionado para `/login`

### ☐ 14. Testar Proteção de Rotas
- [ ] Sem estar logado, tente acessar: `http://localhost:9000/#/admin`
- [ ] Deve ser redirecionado automaticamente para `/login`

---

## 🎉 Finalização

### ☐ 15. Confirmar que tudo está funcionando
- [ ] Login funciona ✅
- [ ] Criar evento funciona ✅
- [ ] Editar evento funciona ✅
- [ ] Deletar evento funciona ✅
- [ ] Visualizar no site funciona ✅
- [ ] Logout funciona ✅
- [ ] Proteção de rotas funciona ✅
- [ ] Site público ainda funciona normalmente ✅

---

## 🆘 Se algo não funcionar

### Problema com Login
- [ ] Verifique se o metadata do usuário está correto
- [ ] Tente resetar a senha no Supabase Dashboard

### Problema com CRUD
- [ ] Verifique se as 16 políticas RLS foram criadas
- [ ] Execute novamente o script SQL
- [ ] Verifique se RLS está habilitado nas tabelas

### Problema com Site Público
- [ ] Verifique se as políticas de SELECT estão ativas
- [ ] Confirme que não há erros no console do navegador (F12)

### Mais Detalhes
- [ ] Consulte o arquivo `SUPABASE_AUTH_SETUP.md` para troubleshooting detalhado

---

## 📚 Documentação Completa

- **SUPABASE_AUTH_SETUP.md** - Guia completo e detalhado
- **ADMIN_README.md** - Visão geral da área administrativa
- **supabase_rls_policies.sql** - Script SQL das políticas

---

**✨ Parabéns! Sua área administrativa está pronta para uso!**

