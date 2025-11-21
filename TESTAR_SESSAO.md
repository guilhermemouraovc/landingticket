# 🧪 Testar Sessão e JWT no Navegador

## Problema Identificado

O SQL Editor do Supabase não usa a sessão do navegador, então a query de JWT retorna `NULL` (isso é normal).

O problema real é verificar se o **navegador** está enviando o JWT correto com o metadata.

## ✅ Teste 1: Verificar Sessão no Console do Navegador

1. **Faça login** no site: `http://localhost:9000/#/login`
2. **Acesse** `/admin`
3. **Abra o Console** (F12)
4. **Cole e execute** este código:

```javascript
// Verificar sessão atual
const { data: { session } } = await supabase.auth.getSession()
console.log('Sessão:', session)
console.log('User:', session?.user)
console.log('Metadata:', session?.user?.user_metadata)
console.log('is_admin:', session?.user?.user_metadata?.is_admin)
console.log('role:', session?.user?.user_metadata?.role)
```

**Resultado esperado:**
- `is_admin` deve ser `true`
- `role` deve ser `"admin"`

**Se retornar `undefined` ou `null`:**
- O metadata não está no token
- Veja o Passo 2

## ✅ Teste 2: Verificar se o Cliente Supabase está Configurado

No Console do Navegador, execute:

```javascript
// Verificar se supabase está disponível
console.log('Supabase client:', supabase)
console.log('Supabase auth:', supabase.auth)

// Tentar buscar eventos diretamente
const { data, error } = await supabase
  .from('events')
  .select('id, title')
  .limit(5)

console.log('Eventos:', data)
console.log('Erro:', error)
```

**Se der erro de permissão:**
- As políticas RLS estão bloqueando
- Veja o Passo 3

## ✅ Teste 3: Verificar JWT no Request

1. Abra o **Network** tab (F12 > Network)
2. Recarregue a página `/admin`
3. Procure por requests para `supabase.co`
4. Clique em um request
5. Vá na aba **Headers**
6. Procure por **Authorization** header
7. Deve ter um JWT token

**Para ver o conteúdo do JWT:**
1. Copie o token (sem "Bearer ")
2. Vá em https://jwt.io
3. Cole o token
4. Veja a seção **Payload**
5. Procure por `user_metadata`
6. Deve ter `is_admin: true`

## ✅ Testo 4: Forçar Atualização do Metadata

Se o metadata não estiver no JWT:

1. **No Supabase Dashboard:**
   - Vá em **Authentication** > **Users**
   - Clique no seu usuário
   - Em **User Metadata**, edite:
   ```json
   {
     "role": "admin",
     "is_admin": true
   }
   ```
   - Salve

2. **No navegador:**
   - Faça **logout** completo
   - Feche todas as abas
   - Abra uma nova aba
   - Faça **login** novamente
   - O novo JWT deve ter o metadata atualizado

## ✅ Teste 5: Testar Query Direta no Console

No Console do Navegador, execute:

```javascript
// Testar busca de eventos
async function testarEventos() {
  // Verificar sessão primeiro
  const { data: { session } } = await supabase.auth.getSession()
  console.log('Sessão ativa:', !!session)
  console.log('User ID:', session?.user?.id)
  console.log('Metadata:', session?.user?.user_metadata)
  
  // Tentar buscar eventos
  const { data, error } = await supabase
    .from('events')
    .select('id, title, created_at')
    .limit(10)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('❌ Erro:', error)
    console.error('Mensagem:', error.message)
    console.error('Detalhes:', error.details)
    console.error('Hint:', error.hint)
  } else {
    console.log('✅ Sucesso! Eventos encontrados:', data?.length || 0)
    console.log('Eventos:', data)
  }
  
  return { data, error }
}

// Executar
testarEventos()
```

**Se der erro:**
- Copie a mensagem de erro completa
- Veja qual é o código de erro (ex: "42501" = permission denied)

## 🔍 Erros Comuns e Soluções

### Erro: "new row violates row-level security policy"
**Solução:** As políticas de INSERT não estão permitindo. Execute `VERIFICAR_RLS.sql`

### Erro: "permission denied for table events"
**Solução:** RLS está bloqueando. Verifique se as políticas existem.

### Erro: "JWT expired"
**Solução:** Faça logout e login novamente.

### Metadata retorna `null` ou `undefined`
**Solução:**
1. Edite o User Metadata no Supabase
2. Faça logout completo
3. Faça login novamente
4. O novo JWT terá o metadata atualizado

## 📋 Checklist de Diagnóstico

Execute no Console do Navegador:

```javascript
// 1. Verificar sessão
const { data: { session } } = await supabase.auth.getSession()
console.log('1. Sessão existe?', !!session)
console.log('2. User ID:', session?.user?.id)
console.log('3. Metadata completo:', session?.user?.user_metadata)
console.log('4. is_admin:', session?.user?.user_metadata?.is_admin)
console.log('5. role:', session?.user?.user_metadata?.role)

// 2. Testar query simples
const { data, error } = await supabase
  .from('events')
  .select('count')
  .single()

console.log('6. Query funcionou?', !error)
console.log('7. Erro (se houver):', error)
```

**Todos devem retornar valores válidos (não null/undefined)**

