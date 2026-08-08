import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { forgetUser } from '../memory.js';

export const data = new SlashCommandBuilder()
  .setName('olvidar')
  .setDescription('Borra todo lo que el bot recuerda sobre vos');

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  await forgetUser(interaction.user.id);
  await interaction.reply({ content: 'Listo, borré todo lo que sabía de vos.', ephemeral: true });
}