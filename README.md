# Discord Memory Bot (TypeScript)

Bot de Discord con IA (Groq, gratis) que recuerda datos de cada usuario entre conversaciones, usando Supabase como base de datos. Versión tipada con TypeScript.

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

## Desarrollo vs producción

- **Desarrollo** (recarga automática con `tsx`, sin compilar):
  ```
  npm run dev
  ```

- **Producción** (compila TS a JS y corre el build):
  ```
  npm run build
  npm start
  ```

## Estructura

```
src/
├── index.ts              # entry point, maneja el cliente de Discord
├── types.ts              # interfaces compartidas (ChatMessage, UserMemory, etc.)
├── memory.ts             # lectura/escritura de memoria en Supabase
├── ai.ts                 # llamada a Groq con contexto + memoria
├── deploy-commands.ts    # registra los slash commands en Discord
└── commands/
    ├── chat.ts
    ├── recordar.ts
    └── olvidar.ts
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