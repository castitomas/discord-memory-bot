const TYPE_CACHE = new Map<string, { damage_relations: any }>();

interface PokemonData {
  name: string;
  types: string[];
  abilities: { name: string; isHidden: boolean }[];
}

async function fetchType(typeName: string) {
  if (TYPE_CACHE.has(typeName)) return TYPE_CACHE.get(typeName)!;
  const res = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`);
  if (!res.ok) throw new Error(`No se encontró el tipo ${typeName}`);
  const data = await res.json();
  TYPE_CACHE.set(typeName, data);
  return data;
}

export async function fetchPokemon(nombre: string): Promise<PokemonData> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`);
  if (!res.ok) throw new Error(`No encontré ningún Pokémon llamado "${nombre}"`);
  const data = await res.json();

  return {
    name: data.name,
    types: data.types.map((t: any) => t.type.name),
    abilities: data.abilities.map((a: any) => ({
      name: a.ability.name,
      isHidden: a.is_hidden,
    })),
  };
}

export async function getWeaknesses(types: string[]): Promise<Record<string, number>> {
  const multipliers: Record<string, number> = {};

  for (const typeName of types) {
    const typeData = await fetchType(typeName);
    const relations = typeData.damage_relations;

    for (const t of relations.double_damage_from) {
      multipliers[t.name] = (multipliers[t.name] ?? 1) * 2;
    }
    for (const t of relations.half_damage_from) {
      multipliers[t.name] = (multipliers[t.name] ?? 1) * 0.5;
    }
    for (const t of relations.no_damage_from) {
      multipliers[t.name] = (multipliers[t.name] ?? 1) * 0;
    }
  }

  return multipliers;
}