-- ============================================
-- POLÍTICAS RLS PARA LANDINGTICKET
-- Autenticação e Área Administrativa
-- ============================================
-- 
-- Este script configura todas as políticas RLS necessárias
-- para permitir:
-- - Leitura pública de eventos (site funciona normalmente)
-- - Escrita apenas para admins autenticados
--
-- Execute este script no SQL Editor do Supabase Dashboard
-- ============================================

-- Habilitar RLS nas tabelas (caso ainda não esteja habilitado)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TABELA: events
-- ============================================

-- Leitura pública (qualquer pessoa pode ver eventos)
CREATE POLICY "Permitir leitura pública de eventos"
ON public.events
FOR SELECT
TO public
USING (true);

-- Inserção apenas para admins
CREATE POLICY "Permitir inserção para admins"
ON public.events
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
);

-- Atualização apenas para admins
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

-- Deleção apenas para admins
CREATE POLICY "Permitir deleção para admins"
ON public.events
FOR DELETE
TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
);

-- ============================================
-- TABELA: event_images
-- ============================================

-- Leitura pública
CREATE POLICY "Permitir leitura pública de imagens"
ON public.event_images
FOR SELECT
TO public
USING (true);

-- Inserção apenas para admins
CREATE POLICY "Permitir inserção de imagens para admins"
ON public.event_images
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
);

-- Atualização apenas para admins
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

-- Deleção apenas para admins
CREATE POLICY "Permitir deleção de imagens para admins"
ON public.event_images
FOR DELETE
TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
);

-- ============================================
-- TABELA: event_tags
-- ============================================

-- Leitura pública
CREATE POLICY "Permitir leitura pública de event_tags"
ON public.event_tags
FOR SELECT
TO public
USING (true);

-- Inserção apenas para admins
CREATE POLICY "Permitir inserção de event_tags para admins"
ON public.event_tags
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
);

-- Atualização apenas para admins
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

-- Deleção apenas para admins
CREATE POLICY "Permitir deleção de event_tags para admins"
ON public.event_tags
FOR DELETE
TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
);

-- ============================================
-- TABELA: tags
-- ============================================

-- Leitura pública
CREATE POLICY "Permitir leitura pública de tags"
ON public.tags
FOR SELECT
TO public
USING (true);

-- Inserção apenas para admins
CREATE POLICY "Permitir inserção de tags para admins"
ON public.tags
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
);

-- Atualização apenas para admins
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

-- Deleção apenas para admins
CREATE POLICY "Permitir deleção de tags para admins"
ON public.tags
FOR DELETE
TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
);

-- ============================================
-- VERIFICAR POLÍTICAS CRIADAS
-- ============================================
-- Execute esta query para confirmar que todas as políticas foram criadas:
-- 
-- SELECT schemaname, tablename, policyname, cmd
-- FROM pg_policies 
-- WHERE schemaname = 'public'
-- ORDER BY tablename, cmd;
-- 
-- Você deve ver 4 políticas para cada tabela (SELECT, INSERT, UPDATE, DELETE)
-- ============================================

