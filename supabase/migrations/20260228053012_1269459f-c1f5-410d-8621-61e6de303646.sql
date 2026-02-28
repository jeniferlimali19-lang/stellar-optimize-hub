
-- Tabela para armazenar senhas de acesso criadas pelo ADM
CREATE TABLE public.access_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  password TEXT NOT NULL,
  label TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.access_keys ENABLE ROW LEVEL SECURITY;

-- Qualquer um pode ler senhas ativas (para validar login)
CREATE POLICY "Anyone can read active keys"
ON public.access_keys
FOR SELECT
USING (active = true);

-- Qualquer um pode inserir (ADM não autenticado via auth)
CREATE POLICY "Anyone can insert keys"
ON public.access_keys
FOR INSERT
WITH CHECK (true);

-- Qualquer um pode atualizar (para desativar)
CREATE POLICY "Anyone can update keys"
ON public.access_keys
FOR UPDATE
USING (true);

-- Qualquer um pode deletar
CREATE POLICY "Anyone can delete keys"
ON public.access_keys
FOR DELETE
USING (true);
