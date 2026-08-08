import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { fetchPokemon, getWeaknesses } from '../pokemonApi.js';

export const data = new SlashCommandBuilder()
  .setName('pokemon')
  .setDescription('Debilidades y habilidades de un Pokémon')
  .addStringOption(option =>
    option.setName('nombre')
      .setDescription('Nombre del Pokémon (en inglés, ej: charizard)')
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.deferReply();

  const nombre = interaction.options.getString('nombre', true);

  try {
    const pokemon = await fetchPokemon(nombre);
    const weaknesses = await getWeaknesses(pokemon.types);

    const debiles = Object.entries(weaknesses)
      .filter(([, mult]) => mult > 1)
      .map(([type, mult]) => `${type} (x${mult})`)
      .join(', ') || 'ninguna';

    const resistencias = Object.entries(weaknesses)
      .filter(([, mult]) => mult < 1 && mult > 0)
      .map(([type, mult]) => `${type} (x${mult})`)
      .join(', ') || 'ninguna';

    const inmunidades = Object.entries(weaknesses)
      .filter(([, mult]) => mult === 0)
      .map(([type]) => type)
      .join(', ') || 'ninguna';

    const habilidades = pokemon.abilities
      .map(a => a.isHidden ? `${a.name} (oculta)` : a.name)
      .join(', ');

    const embed = new EmbedBuilder()
      .setTitle(pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1))
      .addFields(
        { name: 'Tipo', value: pokemon.types.join(' / '), inline: false },
        { name: 'Débil contra', value: debiles, inline: false },
        { name: 'Resiste', value: resistencias, inline: false },
        { name: 'Inmune a', value: inmunidades, inline: false },
        { name: 'Habilidades', value: habilidades, inline: false },
      );

    await interaction.editReply({ embeds: [embed] });
  } catch (err: any) {
    await interaction.editReply(err.message ?? 'Hubo un error buscando ese Pokémon.');
  }
}