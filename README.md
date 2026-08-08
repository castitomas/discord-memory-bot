# Discord Memory Bot (TypeScript)

Bot de Discord con IA (Groq, gratis) que recuerda datos de cada usuario entre conversaciones, usando Supabase como base de datos. Versión tipada con TypeScript.

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