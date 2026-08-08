import { VoiceState, Guild, VoiceChannel } from 'discord.js';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_KEY as string
);

// Trackea qué canales ya tienen una llamada "activa" avisada, para no notificar de nuevo
// en cada join, solo cuando arranca de cero.
const activeCallChannels = new Set<string>();

async function isNotificationsEnabled(userId: string): Promise<boolean> {
    const { data } = await supabase
        .from('notification_prefs')
        .select('enabled')
        .eq('user_id', userId)
        .maybeSingle();

    // Si no hay registro, por defecto están activadas
    return data?.enabled ?? true;
}

async function notifyAbsentMembers(channel: VoiceChannel, guild: Guild) {
    const membersInCall = new Set(channel.members.filter(m => !m.user.bot).map(m => m.id));

    await guild.members.fetch(); // trae todos los miembros (necesita el intent GuildMembers)

    const toNotify = guild.members.cache.filter(
        (member) => !member.user.bot && !membersInCall.has(member.id)
    );

    for (const [, member] of toNotify) {
        const enabled = await isNotificationsEnabled(member.id);
        if (!enabled) continue;

        try {
            await member.send(
                `🔊 Se arrancó una llamada en **${channel.name}** (${guild.name}). ¡Sumate si querés!`
            );
        } catch {
            // El usuario tiene los DMs cerrados, no hacemos nada
        }

        await new Promise((resolve) => setTimeout(resolve, 500)); // escalonar envíos
    }
}

export async function handleVoiceStateUpdate(oldState: VoiceState, newState: VoiceState) {
    const channel = newState.channel;
    if (!channel || channel.type !== 2 /* GuildVoice */) return;
    if (oldState.channelId === newState.channelId) return; // no cambió de canal

    const humanMembers = channel.members.filter((m) => !m.user.bot);

    // Si es la primera persona humana en el canal, arranca la "llamada"
    if (humanMembers.size === 1 && !activeCallChannels.has(channel.id)) {
        activeCallChannels.add(channel.id);
        await notifyAbsentMembers(channel as VoiceChannel, newState.guild);
    }

    // Si el canal quedó vacío, reseteamos para que la próxima vez vuelva a avisar
    if (humanMembers.size === 0) {
        activeCallChannels.delete(channel.id);
    }
}