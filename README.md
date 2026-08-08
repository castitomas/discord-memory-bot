# Discord Memory Bot

Bot de Discord con IA (Groq, gratis) que recuerda datos de cada usuario entre conversaciones, usando Supabase como base de datos.

## Setup

1. **Discord**: creá una app en https://discord.com/developers/applications, sacá el `token` y el `client id`, activá el bot (Bot > Reset Token) e invitalo a tu server con permisos de `applications.commands` y `bot`.

2. **Groq**: creá cuenta gratis en https://console.groq.com y generá una API key.

3. **Supabase**: creá un proyecto gratis en https://supabase.com, andá al SQL editor y corré el contenido de `schema.sql`. Copiá la URL y la `service_role key` del proyecto (Settings > API).

4. Copiá `.env.example` a `.env` y completá los valores.

5. Instalá dependencias:
   ```
   npm install
   ```

6. Registrá los slash commands (solo la primera vez o cuando cambies comandos):
   ```
   npm run deploy-commands
   ```

7. Corré el bot:
   ```
   npm start
   ```

## Comandos

- `/chat mensaje:<texto>` — hablar con el bot, usa memoria de conversaciones recientes + datos guardados.
- `/recordar dato:<texto>` — le pedís que recuerde algo puntual sobre vos ("me gusta el rock").
- `/olvidar` — borra todo lo que el bot sabe de vos.

## Ideas para ampliar (para el portfolio)

- Resumir automáticamente conversaciones largas de un canal.
- Extraer "hechos" automáticamente de los mensajes del usuario (sin usar `/recordar`) usando el propio modelo para detectar info relevante.
- Panel web (Next.js) para que cada usuario vea/edite lo que el bot recuerda de él.
- Rate limiting por usuario para no gastar de más la cuota gratis de Groq.
