import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { getMemory, pushHistory } from '../memory.js';
import { generateReply } from '../ai.js';
import { checkRateLimit } from '../rateLimit.js';


export const data = new SlashCommandBuilder()
  .setName('chat')
  .setDescription('Hablá con el bot (recuerda cosas de vos)')
  .addStringOption(option =>
    option.setName('mensaje')
      .setDescription('Qué le querés decir')
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  const userId = interaction.user.id;

  const rate = checkRateLimit(userId);
  if (!rate.allowed) {
    const seconds = Math.ceil((rate.retryInMs ?? 0) / 1000);
    await interaction.reply({ content: `Esperá ${seconds}s antes de volver a usar /chat.`, ephemeral: true });
    return;
  }

  await interaction.deferReply();

  const username = interaction.user.username;
  const userMessage = interaction.options.getString('mensaje', true);

  const mem = await getMemory(userId, username);
  const reply = await generateReply({
    username,
    facts: mem.facts,
    history: mem.history,
    userMessage,
  });

  await pushHistory(userId, 'user', userMessage);
  await pushHistory(userId, 'assistant', reply);

  await interaction.editReply(reply.slice(0, 2000)); // límite de Discord por mensaje
}