import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import { data as chatCmd } from './commands/chat.js';
import { data as recordarCmd } from './commands/remember.js';
import { data as olvidarCmd } from './commands/forget.js';
import { data as pokemonCmd } from './commands/pokemon.js';
import { data as notificationsCmd } from './commands/notifications.js'

const commands = [chatCmd, recordarCmd, olvidarCmd, pokemonCmd, notificationsCmd].map(c => c.toJSON());

const rest = new REST().setToken(process.env.DISCORD_TOKEN as string);

try {
  console.log('Registrando slash commands...');
  await rest.put(
    Routes.applicationGuildCommands(
      process.env.DISCORD_CLIENT_ID as string,
      process.env.DISCORD_GUILD_ID as string
    ),
    { body: commands }
  );
  console.log('Listo (comandos de servidor, instantáneos).');
} catch (err) {
  console.error(err);
}