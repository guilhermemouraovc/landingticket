# 🔧 Troubleshooting - Área Admin não mostra eventos

## Problema: "Nenhum evento encontrado" mesmo após configurar RLS

### ✅ Passo 1: Verificar se está autenticado

1. Abra o **Console do Navegador** (F12)
2. Vá na aba **Console**
3. Procure por erros relacionados a "RLS" ou "permission denied"
4. Veja se aparece algum erro ao carregar eventos

### ✅ Passo 2: Verificar Metadata do Usuário

1. No **Supabase Dashboard**, vá em **Authentication** > **Users**
2. Clique no seu usuário
3. Verifique a seção **User Metadata**
4. Deve conter exatamente:
```json
{
  "role": "admin",
  "is_admin": true
}
```

**Se não estiver assim:**
- Clique em **Edit** no User Metadata
- Cole o JSON acima
- Clique em **Save**

### ✅ Passo 3: Verificar Políticas RLS

1. No **Supabase Dashboard**, vá em **SQL Editor**
2. Execute esta query para verificar as políticas:
```sql
SELECT 
  tablename,
  policyname,
  cmd as command
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'events'
ORDER BY cmd;
```

**Você deve ver pelo menos:**
- `Permitir leitura pública de eventos` (SELECT, TO public)
- `Permitir inserção para admins` (INSERT, TO authenticated)
- `Permitir atualização para admins` (UPDATE, TO authenticated)
- `Permitir deleção para admins` (DELETE, TO authenticated)

### ✅ Passo 4: Testar JWT do Usuário

Execute esta query no **SQL Editor** enquanto estiver logado:

```sql
SELECT 
  auth.uid() as user_id,
  auth.jwt() -> 'user_metadata' as user_metadata,
  auth.jwt() -> 'user_metadata' ->> 'is_admin' as is_admin,
  auth.jwt() -> 'user_metadata' ->> 'role' as role;
```

**Resultado esperado:**
- `is_admin` deve ser `true` ou `"true"`
- `role` deve ser `"admin"`

**Se retornar `null`:**
- O metadata não está sendo lido corretamente
- Faça logout e login novamente
- Verifique se o metadata está correto (Passo 2)

### ✅ Passo 5: Testar Acesso Direto

Execute esta query no **SQL Editor**:

```sql
SELECT COUNT(*) as total FROM public.events;
```

**Se retornar um número:**
- As políticas de SELECT estão funcionando
- O problema pode ser na query com relacionamentos

**Se der erro de permissão:**
- As políticas RLS não estão configuradas corretamente
- Execute o script `VERIFICAR_RLS.sql`

### ✅ Passo 6: Recriar Políticas (se necessário)

1. Execute o arquivo `VERIFICAR_RLS.sql` no **SQL Editor**
2. Este script:
   - Remove políticas antigas
   - Recria com verificação melhorada
   - Testa o acesso

### ✅ Passo 7: Verificar Console do Navegador

1. Abra o **Console** (F12)
2. Recarregue a página `/admin`
3. Procure por:
   - Erros em vermelho
   - Mensagens sobre "RLS" ou "permission"
   - Erros do Supabase

**Erros comuns:**

**Erro: "new row violates row-level security policy"**
→ As políticas de INSERT/UPDATE não estão permitindo
→ Execute `VERIFICAR_RLS.sql`

**Erro: "permission denied for table events"**
→ RLS está bloqueando completamente
→ Verifique se RLS está habilitado e as políticas existem

**Erro: "JWT expired" ou "Invalid JWT"**
→ Faça logout e login novamente

### ✅ Passo 8: Fazer Logout e Login Novamente

1. Clique em **Sair** na área admin
2. Feche todas as abas do site
3. Abra uma nova aba
4. Acesse `http://localhost:9000/#/login`
5. Faça login novamente
6. Acesse `/admin`

### ✅ Passo 9: Verificar Variáveis de Ambiente

Certifique-se de que o arquivo `.env` contém:

```env
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_KEY=sua_chave_anon_aqui
```

**Importante:** Use a **anon key**, não a service_role key!

### ✅ Passo 10: Verificar se há Eventos no Banco

Execute no **SQL Editor**:

```sql
SELECT id, title, created_at 
FROM public.events 
ORDER BY created_at DESC 
LIMIT 10;
```

**Se não retornar nenhum evento:**
- Não há eventos cadastrados ainda
- Crie um evento pelo admin ou diretamente no banco

**Se retornar eventos:**
- O problema é nas políticas RLS ou na autenticação
- Continue com os passos acima

---

## 🔍 Diagnóstico Rápido

Execute esta query completa no **SQL Editor** para diagnóstico:

```sql
-- 1. Verificar RLS
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'events';

-- 2. Verificar Políticas
SELECT policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'events';

-- 3. Verificar JWT
SELECT 
  auth.uid() as user_id,
  auth.jwt() -> 'user_metadata' ->> 'is_admin' as is_admin;

-- 4. Testar SELECT
SELECT COUNT(*) FROM public.events;
```

---

## 🆘 Se Nada Funcionar

1. **Desabilite RLS temporariamente** (apenas para teste):
```sql
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;
```

2. **Teste se consegue ver eventos**
   - Se sim: problema nas políticas
   - Se não: problema na query ou conexão

3. **Reabilite RLS**:
```sql
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
```

4. **Execute o script completo** `supabase_rls_policies.sql` novamente

---

## 📞 Informações para Debug

Se precisar de ajuda, forneça:

1. **Erro exato do console** (copie e cole)
2. **Resultado da query de JWT** (Passo 4)
3. **Resultado da query de políticas** (Passo 3)
4. **Screenshot do User Metadata** no Supabase

---

## ✅ Checklist Final

- [ ] User Metadata está correto (`is_admin: true`)
- [ ] RLS está habilitado nas tabelas
- [ ] Políticas existem e estão corretas
- [ ] JWT contém `is_admin: true`
- [ ] Fez logout e login novamente
- [ ] Console não mostra erros de RLS
- [ ] Query direta no SQL Editor funciona

