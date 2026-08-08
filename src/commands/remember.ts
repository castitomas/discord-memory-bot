import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { addFact } from '../memory.js';

export const data = new SlashCommandBuilder()
  .setName('recordar')
  .setDescription('Pedile al bot que recuerde algo sobre vos')
  .addStringOption(option =>
    option.setName('dato')
      .setDescription('Ej: "me gusta el rock", "soy programador"')
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  const dato = interaction.options.getString('dato', true);
  await addFact(interaction.user.id, dato);
  await interaction.reply({ content: `Listo, lo voy a tener en cuenta: "${dato}"`, ephemeral: true });
}