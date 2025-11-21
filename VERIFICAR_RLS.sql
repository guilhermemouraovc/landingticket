-- ============================================
-- SCRIPT DE VERIFICAÇÃO E CORREÇÃO DE RLS
-- ============================================
-- Execute este script para verificar e corrigir problemas com RLS
-- ============================================

-- 1. VERIFICAR SE RLS ESTÁ HABILITADO
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('events', 'event_images', 'event_tags', 'tags')
ORDER BY tablename;

-- 2. VERIFICAR TODAS AS POLÍTICAS EXISTENTES
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd as command,
  roles,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('events', 'event_images', 'event_tags', 'tags')
ORDER BY tablename, cmd;

-- 3. REMOVER POLÍTICAS ANTIGAS (se necessário recriar)
-- Descomente as linhas abaixo se precisar remover políticas duplicadas:

-- DROP POLICY IF EXISTS "Permitir leitura pública de eventos" ON public.events;
-- DROP POLICY IF EXISTS "Permitir inserção para admins" ON public.events;
-- DROP POLICY IF EXISTS "Permitir atualização para admins" ON public.events;
-- DROP POLICY IF EXISTS "Permitir deleção para admins" ON public.events;

-- 4. RECRIAR POLÍTICAS COM VERIFICAÇÃO MELHORADA
-- Para a tabela events - SELECT (leitura pública)
DROP POLICY IF EXISTS "Permitir leitura pública de eventos" ON public.events;
CREATE POLICY "Permitir leitura pública de eventos"
ON public.events
FOR SELECT
TO public
USING (true);

-- Para admins autenticados - todas as operações
-- SELECT para admins (redundante mas garante acesso)
DROP POLICY IF EXISTS "Admins podem ler eventos" ON public.events;
CREATE POLICY "Admins podem ler eventos"
ON public.events
FOR SELECT
TO authenticated
USING (
  COALESCE((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean, false) = true
  OR (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
);

-- INSERT para admins
DROP POLICY IF EXISTS "Permitir inserção para admins" ON public.events;
CREATE POLICY "Permitir inserção para admins"
ON public.events
FOR INSERT
TO authenticated
WITH CHECK (
  COALESCE((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean, false) = true
  OR (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
);

-- UPDATE para admins
DROP POLICY IF EXISTS "Permitir atualização para admins" ON public.events;
CREATE POLICY "Permitir atualização para admins"
ON public.events
FOR UPDATE
TO authenticated
USING (
  COALESCE((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean, false) = true
  OR (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
)
WITH CHECK (
  COALESCE((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean, false) = true
  OR (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
);

-- DELETE para admins
DROP POLICY IF EXISTS "Permitir deleção para admins" ON public.events;
CREATE POLICY "Permitir deleção para admins"
ON public.events
FOR DELETE
TO authenticated
USING (
  COALESCE((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean, false) = true
  OR (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
);

-- ============================================
-- TESTE: Verificar JWT do usuário atual
-- ============================================
-- Execute esta query enquanto estiver logado para ver seu JWT:
SELECT 
  auth.uid() as user_id,
  auth.jwt() -> 'user_metadata' as user_metadata,
  auth.jwt() -> 'user_metadata' ->> 'is_admin' as is_admin,
  auth.jwt() -> 'user_metadata' ->> 'role' as role;

-- ============================================
-- TESTE: Tentar ler eventos como admin
-- ============================================
-- Esta query deve retornar eventos se você for admin:
SELECT COUNT(*) as total_eventos FROM public.events;

-- ============================================
-- NOTA: Se ainda não funcionar
-- ============================================
-- 1. Verifique se o metadata do usuário está correto:
--    - Vá em Authentication > Users
--    - Clique no seu usuário
--    - Verifique User Metadata: {"role":"admin","is_admin":true}
--
-- 2. Faça logout e login novamente no site
--
-- 3. Verifique o console do navegador para erros específicos

