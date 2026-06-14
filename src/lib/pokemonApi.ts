import type {
  PokemonDetail,
  PokemonListItem,
  PokemonListResponse,
  PokemonSpecies,
} from "@/types/pokemon";

export type { PokemonListItem, PokemonDetail, PokemonSpecies };

function getPokemonId(url: string): number {
  const parts = url.split("/").filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
}

export function getPokemonSprite(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export async function fetchPokemonList(
  offset = 0,
  limit = 20
): Promise<{ pokemons: PokemonListItem[]; hasMore: boolean }> {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
  );
  if (!response.ok) throw new Error("Failed to fetch Pokémon list");
  const data: PokemonListResponse = await response.json();

  return {
    pokemons: data.results.map((item) => ({
      ...item,
      id: getPokemonId(item.url),
    })),
    hasMore: data.next !== null,
  };
}

export async function fetchPokemonDetail(id: number): Promise<PokemonDetail> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!response.ok) throw new Error("Failed to fetch Pokémon details");
  return response.json();
}

export async function fetchPokemonSpecies(id: number): Promise<PokemonSpecies> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
  if (!response.ok) throw new Error("Failed to fetch species data");
  return response.json();
}
