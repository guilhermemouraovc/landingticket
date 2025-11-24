# Guia de Configuração: Autenticação e Admin com Supabase

Este documento fornece o passo a passo completo para configurar a autenticação e área administrativa do LandingTicket usando Supabase.

## 📋 Índice

1. [Habilitar Autenticação no Supabase](#1-habilitar-autenticação-no-supabase)
2. [Criar Usuário Administrador](#2-criar-usuário-administrador)
3. [Configurar Políticas RLS (Row Level Security)](#3-configurar-políticas-rls)
4. [Testar a Implementação](#4-testar-a-implementação)
5. [Troubleshooting](#5-troubleshooting)

---

## 1. Habilitar Autenticação no Supabase

### Passo 1.1: Acessar o Dashboard do Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Selecione o projeto **LandingTicket**

### Passo 1.2: Configurar Authentication

1. No menu lateral, clique em **Authentication**
2. Vá para a aba **Providers**
3. Certifique-se de que o provider **Email** está habilitado:
   - Deve estar com status **Enabled**
   - Se não estiver, clique em **Email** e habilite
   - **Confirm email**: Pode deixar **desabilitado** para simplificar (ou habilite se quiser confirmação por email)
   - **Secure email change**: Recomendado deixar **habilitado**

### Passo 1.3: Configurar URLs de Redirect (Opcional)

1. Ainda em **Authentication**, vá para **URL Configuration**
2. Configure as URLs permitidas:
   - **Site URL**: `http://localhost:9000` (para desenvolvimento)
   - **Redirect URLs**: Adicione:
     - `http://localhost:9000/#/admin`
     - `https://seudominio.com.br` (quando for para produção)

---

## 2. Criar Usuário Administrador

### Passo 2.1: Criar o Usuário

1. No menu lateral, clique em **Authentication** > **Users**
2. Clique no botão **Add user** (ou **Invite**)
3. Escolha **Create new user**
4. Preencha os dados:
   - **Email**: `seu-email@exemplo.com` (use seu email real)
   - **Password**: Crie uma senha forte (mínimo 6 caracteres)
   - **Auto Confirm User**: Marque como **Yes** para não precisar confirmar email
5. Clique em **Create user**

### Passo 2.2: Adicionar Metadata de Admin

Agora precisamos marcar este usuário como administrador:

1. Na lista de usuários, clique no usuário que você acabou de criar
2. Role até a seção **User Metadata**
3. Clique em **Edit** (ícone de lápis)
4. No campo JSON, adicione:

```json
{
  "role": "admin",
  "is_admin": true
}
```

5. Clique em **Save**

**Importante:** Esse metadata é o que permite que o usuário acesse a área administrativa.

---

## 3. Configurar Políticas RLS (Row Level Security)

As políticas RLS garantem que:

- ✅ Qualquer pessoa pode **ler** eventos (visualizar o site)
- ✅ Apenas usuários autenticados com role admin podem **criar/editar/deletar** eventos

### Passo 3.1: Habilitar RLS nas Tabelas

1. No menu lateral, clique em **Database** > **Tables**
2. Para cada tabela abaixo, faça:
   - Clique na tabela
   - Vá para a aba **RLS Policies**
   - Se RLS não estiver habilitado, clique em **Enable RLS**

**Tabelas que precisam ter RLS habilitado:**

- `events`
- `event_tags`
- `event_images`
- `tags`

### Passo 3.2: Criar Políticas para a Tabela `events`

#### Política 1: Leitura Pública (SELECT)

1. Na tabela `events`, clique em **New Policy**
2. Escolha **Create a policy from scratch**
3. Preencha:
   - **Policy name**: `Permitir leitura pública de eventos`
   - **Policy command**: `SELECT`
   - **Target roles**: `public` (ou `anon`)
   - **USING expression**: `true`
4. Clique em **Save**

Ou use o SQL direto:

```sql
CREATE POLICY "Permitir leitura pública de eventos"
ON public.events
FOR SELECT
TO public
USING (true);
```

#### Política 2: Inserção para Admins (INSERT)

```sql
CREATE POLICY "Permitir inserção para admins"
ON public.events
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
);
```

#### Política 3: Atualização para Admins (UPDATE)

```sql
CREATE POLICY "Permitir atualização para admins"
ON public.events
FOR UPDATE
TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
)
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
);
```

#### Política 4: Deleção para Admins (DELETE)

```sql
CREATE POLICY "Permitir deleção para admins"
ON public.events
FOR DELETE
TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
);
```

### Passo 3.3: Criar Políticas para a Tabela `event_images`

Execute esses comandos SQL no **SQL Editor**:

```sql
-- Leitura pública
CREATE POLICY "Permitir leitura pública de imagens"
ON public.event_images
FOR SELECT
TO public
USING (true);

-- Inserção para admins
CREATE POLICY "Permitir inserção de imagens para admins"
ON public.event_images
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
);

-- Atualização para admins
CREATE POLICY "Permitir atualização de imagens para admins"
ON public.event_images
FOR UPDATE
TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
)
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
);

-- Deleção para admins
CREATE POLICY "Permitir deleção de imagens para admins"
ON public.event_images
FOR DELETE
TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
);
```

### Passo 3.4: Criar Políticas para a Tabela `event_tags`

```sql
-- Leitura pública
CREATE POLICY "Permitir leitura pública de event_tags"
ON public.event_tags
FOR SELECT
TO public
USING (true);

-- Inserção para admins
CREATE POLICY "Permitir inserção de event_tags para admins"
ON public.event_tags
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
);

-- Atualização para admins
CREATE POLICY "Permitir atualização de event_tags para admins"
ON public.event_tags
FOR UPDATE
TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
)
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
);

-- Deleção para admins
CREATE POLICY "Permitir deleção de event_tags para admins"
ON public.event_tags
FOR DELETE
TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
);
```

### Passo 3.5: Criar Políticas para a Tabela `tags`

```sql
-- Leitura pública
CREATE POLICY "Permitir leitura pública de tags"
ON public.tags
FOR SELECT
TO public
USING (true);

-- Inserção para admins
CREATE POLICY "Permitir inserção de tags para admins"
ON public.tags
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
);

-- Atualização para admins
CREATE POLICY "Permitir atualização de tags para admins"
ON public.tags
FOR UPDATE
TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
)
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
);

-- Deleção para admins
CREATE POLICY "Permitir deleção de tags para admins"
ON public.tags
FOR DELETE
TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
);
```

### Passo 3.6: Aplicar Todas as Políticas de Uma Vez

Para facilitar, você pode executar **este script completo** no SQL Editor do Supabase:

```sql
-- ============================================
-- POLÍTICAS RLS PARA LANDINGTICKET
-- ============================================

-- EVENTS
CREATE POLICY "Permitir leitura pública de eventos" ON public.events FOR SELECT TO public USING (true);
CREATE POLICY "Permitir inserção para admins" ON public.events FOR INSERT TO authenticated WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true);
CREATE POLICY "Permitir atualização para admins" ON public.events FOR UPDATE TO authenticated USING ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true) WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true);
CREATE POLICY "Permitir deleção para admins" ON public.events FOR DELETE TO authenticated USING ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true);

-- EVENT_IMAGES
CREATE POLICY "Permitir leitura pública de imagens" ON public.event_images FOR SELECT TO public USING (true);
CREATE POLICY "Permitir inserção de imagens para admins" ON public.event_images FOR INSERT TO authenticated WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true);
CREATE POLICY "Permitir atualização de imagens para admins" ON public.event_images FOR UPDATE TO authenticated USING ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true) WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true);
CREATE POLICY "Permitir deleção de imagens para admins" ON public.event_images FOR DELETE TO authenticated USING ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true);

-- EVENT_TAGS
CREATE POLICY "Permitir leitura pública de event_tags" ON public.event_tags FOR SELECT TO public USING (true);
CREATE POLICY "Permitir inserção de event_tags para admins" ON public.event_tags FOR INSERT TO authenticated WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true);
CREATE POLICY "Permitir atualização de event_tags para admins" ON public.event_tags FOR UPDATE TO authenticated USING ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true) WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true);
CREATE POLICY "Permitir deleção de event_tags para admins" ON public.event_tags FOR DELETE TO authenticated USING ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true);

-- TAGS
CREATE POLICY "Permitir leitura pública de tags" ON public.tags FOR SELECT TO public USING (true);
CREATE POLICY "Permitir inserção de tags para admins" ON public.tags FOR INSERT TO authenticated WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true);
CREATE POLICY "Permitir atualização de tags para admins" ON public.tags FOR UPDATE TO authenticated USING ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true) WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true);
CREATE POLICY "Permitir deleção de tags para admins" ON public.tags FOR DELETE TO authenticated USING ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true);
```

---

## 4. Testar a Implementação

### Passo 4.1: Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

O servidor deve iniciar em `http://localhost:9000`

### Passo 4.2: Testar o Login

1. Acesse: `http://localhost:9000/#/login`
2. Digite o email e senha do usuário admin que você criou
3. Clique em **Entrar**
4. Você deve ser redirecionado para `/admin` e ver a lista de eventos

### Passo 4.3: Testar CRUD de Eventos

1. **Criar Evento**:
   - Clique em **Novo Evento**
   - Preencha os campos obrigatórios (Título)
   - Clique em **Salvar Evento**
   - Verifique se o evento aparece na lista

2. **Editar Evento**:
   - Clique no ícone de **editar** (lápis) em um evento
   - Modifique algum campo
   - Clique em **Salvar Evento**
   - Verifique se as alterações foram salvas

3. **Deletar Evento**:
   - Clique no ícone de **deletar** (lixeira)
   - Confirme a exclusão
   - Verifique se o evento foi removido da lista

4. **Ver Evento no Site**:
   - Clique no ícone de **visualizar** (olho)
   - Uma nova aba deve abrir mostrando o evento no site público

### Passo 4.4: Testar Logout

1. Clique em **Sair** no canto superior direito
2. Você deve ser redirecionado para `/login`
3. Tente acessar `/admin` diretamente
4. Você deve ser redirecionado de volta para `/login`

---

## 5. Troubleshooting

### Problema: "Acesso negado" ao tentar fazer login

**Solução:**

1. Verifique se o metadata do usuário está correto:
   - Vá em **Authentication** > **Users**
   - Clique no usuário
   - Confirme que o **User Metadata** contém:
     ```json
     {
       "role": "admin",
       "is_admin": true
     }
     ```

### Problema: Erro ao criar/editar/deletar eventos

**Solução:**

1. Verifique se as políticas RLS foram criadas corretamente
2. No SQL Editor, execute:
   ```sql
   SELECT * FROM pg_policies WHERE schemaname = 'public';
   ```
3. Você deve ver todas as políticas listadas acima
4. Se alguma estiver faltando, execute o script completo do Passo 3.6

### Problema: Site público não carrega eventos

**Solução:**

1. Verifique se as políticas de **SELECT** (leitura pública) estão ativas
2. Execute no SQL Editor:
   ```sql
   SELECT tablename, policyname FROM pg_policies
   WHERE schemaname = 'public'
   AND cmd = 'SELECT';
   ```
3. Deve retornar as políticas de leitura pública para todas as tabelas

### Problema: "Invalid credentials" ao fazer login

**Solução:**

1. Verifique se o email e senha estão corretos
2. Verifique se o usuário foi confirmado (Auto Confirm User = Yes)
3. Tente resetar a senha do usuário:
   - No Supabase, vá em **Authentication** > **Users**
   - Clique no usuário
   - Clique em **Reset password**

### Problema: Console mostra erros de "row-level security policy"

**Solução:**

1. Certifique-se de que RLS está habilitado em todas as tabelas
2. Verifique se você está logado antes de tentar criar/editar
3. Confirme que o token JWT contém o metadata correto

---

## 🎉 Conclusão

Após seguir todos esses passos, você terá:

✅ Autenticação configurada no Supabase  
✅ Usuário administrador criado  
✅ Políticas RLS configuradas (leitura pública, escrita para admins)  
✅ Área administrativa funcionando em `/admin`  
✅ Página de login em `/login`  
✅ CRUD completo de eventos

## 📝 Próximos Passos Opcionais

1. **Upload de Imagens**: Configurar Supabase Storage para fazer upload de imagens diretamente pelo admin
2. **Múltiplos Admins**: Criar mais usuários administradores
3. **Logs de Auditoria**: Registrar quem criou/editou cada evento
4. **Recuperação de Senha**: Implementar fluxo de "Esqueci minha senha"
5. **2FA**: Adicionar autenticação de dois fatores

## 🔗 Links Úteis

- [Documentação Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security no PostgreSQL](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JWT Claims](https://supabase.com/docs/guides/auth/managing-user-data)

---

**Última atualização:** Novembro 2024  
**Versão:** 1.0
