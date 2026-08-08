import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { ChatMessage, UserMemory } from './types.js';

const supabase: SupabaseClient = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

const MAX_HISTORY = 10; // Contexto

export async function getMemory(userId: string, username?: string): Promise<UserMemory> {
  const { data, error } = await supabase
    .from('user_memory')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle<UserMemory>();

  if (error) throw error;

  if (!data) {
    const fresh: UserMemory = { user_id: userId, username: username ?? 'desconocido', facts: [], history: [] };
    await supabase.from('user_memory').insert(fresh);
    return fresh;
  }

  return data;
}

export async function pushHistory(userId: string, role: ChatMessage['role'], content: string): Promise<ChatMessage[]> {
  const mem = await getMemory(userId);
  const history: ChatMessage[] = [...mem.history, { role, content }].slice(-MAX_HISTORY);

  await supabase
    .from('user_memory')
    .update({ history, updated_at: new Date().toISOString() })
    .eq('user_id', userId);

  return history;
}

export async function addFact(userId: string, fact: string): Promise<string[]> {
  const mem = await getMemory(userId);
  const facts = [...mem.facts, fact];

  await supabase
    .from('user_memory')
    .update({ facts, updated_at: new Date().toISOString() })
    .eq('user_id', userId);

  return facts;
}

export async function forgetUser(userId: string): Promise<void> {
  await supabase.from('user_memory').delete().eq('user_id', userId);
}