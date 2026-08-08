import 'dotenv/config';
import { Client, GatewayIntentBits, Collection, SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import * as chatCmd from './commands/chat.js';
import * as rememberCmd from './commands/remember.js';
import * as forgotCmd from './commands/forget.js';
import * as pokemonCmd from './commands/pokemon.js';
import { handleVoiceStateUpdate } from './callNotifier.js';

interface Command {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

// Extendemos el Client de discord.js para que sepa de nuestra propiedad "commands"
class BotClient extends Client {
  commands: Collection<string, Command> = new Collection();
}

const client = new BotClient({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMembers],
});

for (const cmd of [chatCmd, rememberCmd, forgotCmd, pokemonCmd] as Command[]) {
  client.commands.set(cmd.data.name, cmd);
}

client.once('clientReady', () => {
  console.log(`Bot conectado como ${client.user?.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    console.warn(`Comando no encontrado: ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    const msg = { content: 'Uh, algo se rompió. Probá de nuevo.', ephemeral: true };
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp(msg);
    } else {
      await interaction.reply(msg);
    }
  }
});

client.on('voiceStateUpdate', handleVoiceStateUpdate);

client.login(process.env.DISCORD_TOKEN);