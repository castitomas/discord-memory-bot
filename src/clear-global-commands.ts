import 'dotenv/config';
import { REST, Routes } from 'discord.js';

const rest = new REST().setToken(process.env.DISCORD_TOKEN as string);

try {
    console.log('Borrando comandos globales...');
    await rest.put(
        Routes.applicationCommands(process.env.DISCORD_CLIENT_ID as string),
        { body: [] }
    );
    console.log('Listo, comandos globales borrados.');
} catch (err) {
    console.error(err);
}