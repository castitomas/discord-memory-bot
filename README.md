# Discord Memory Bot

Bot de Discord con inteligencia artificial que mantiene memoria persistente por usuario, escrito en TypeScript.

## ¿Qué hace?

El bot combina un asistente conversacional con IA gratuita (Groq) y una base de datos (Supabase) para recordar información de cada usuario entre conversaciones, además de ofrecer utilidades como consulta de datos de Pokémon y notificaciones automáticas de llamadas de voz en el servidor.

## Funcionalidades

### Chat con memoria (`/chat`)
Conversás con el bot y este responde usando un modelo de lenguaje (Groq, con el modelo `llama-3.1-8b-instant`). Cada respuesta tiene en cuenta:
- El historial reciente de la conversación con ese usuario (últimos mensajes).
- Datos personales que el bot ya guardó sobre esa persona.

Tiene un límite de uso por usuario (rate limiting) para no agotar la cuota gratuita de la API de IA.

### Memoria persistente (`/recordar` y `/olvidar`)
- `/recordar`: le pedís al bot que guarde un dato puntual sobre vos (por ejemplo, un gusto o una característica), que después va a usar para personalizar sus respuestas en `/chat`.
- `/olvidar`: borra por completo todo lo que el bot recuerda de vos.

Toda esta información se guarda en una base de datos (Supabase), por lo que persiste aunque el bot se reinicie.

### Consulta de Pokémon (`/pokemon`)
Devuelve, para el Pokémon que pidas, su tipo, debilidades, resistencias, inmunidades y habilidades (incluyendo habilidades ocultas). Los datos se obtienen de PokeAPI en tiempo real, no de un texto generado por IA, para garantizar que la información sea exacta.

### Notificaciones de llamadas de voz
Cuando alguien inicia una llamada en un canal de voz del servidor (es decir, es la primera persona en entrar), el bot envía un mensaje directo a los demás miembros del servidor que no están en esa llamada, avisándoles que arrancó.

- `/notificaciones`: cada usuario puede activar o desactivar este aviso para sí mismo.
- El bot evita notificar más de una vez por la misma llamada, y vuelve a avisar recién cuando se arma una nueva.

## Stack técnico

| Parte | Tecnología |
|---|---|
| Lenguaje | TypeScript |
| Interacción con Discord | discord.js (slash commands) |
| Modelo de IA | Groq (llama-3.1-8b-instant) |
| Base de datos | Supabase |
| Datos de Pokémon | PokeAPI |
| Linting/formato | Biome |

## Comandos disponibles

| Comando | Descripción |
|---|---|
| `/chat mensaje:<texto>` | Hablar con el bot, usando memoria de conversaciones y datos guardados |
| `/recordar dato:<texto>` | Guardar un dato puntual sobre el usuario |
| `/olvidar` | Borrar toda la memoria del usuario |
| `/pokemon nombre:<texto>` | Consultar tipo, debilidades, resistencias y habilidades de un Pokémon |
| `/notificaciones activar:<true/false>` | Activar o desactivar los avisos de llamadas de voz por DM |