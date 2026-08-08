-- Ejecutar esto en el SQL editor de Supabase

create table if not exists user_memory (
  user_id text primary key,
  username text,
  facts jsonb default '[]'::jsonb,      -- lista de datos que el bot "recuerda" del usuario
  history jsonb default '[]'::jsonb,    -- últimos mensajes de la conversación (para contexto corto)
  updated_at timestamptz default now()
);
