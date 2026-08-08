import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_KEY as string
);

export const data = new SlashCommandBuilder()
    .setName('notificaciones')
    .setDescription('Activá o desactivá los avisos de llamadas por DM')
    .addBooleanOption((option) =>
        option.setName('activar').setDescription('true para activar, false para desactivar').setRequired(true)
    );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const enabled = interaction.options.getBoolean('activar', true);

    await supabase
        .from('notification_prefs')
        .upsert({ user_id: interaction.user.id, enabled });

    await interaction.reply({
        content: enabled ? 'Listo, te voy a avisar cuando arranque una llamada.' : 'Listo, no te voy a mandar más avisos.',
        ephemeral: true,
    });
}