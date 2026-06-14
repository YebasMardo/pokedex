export type PokemonListItem = {
  name: string;
  url: string;
  id: number;
};

export type PokemonListResponse = {
  count: number;
  next: string | null;
  results: { name: string; url: string }[];
};

export type PokemonType = {
  slot: number;
  type: { name: string; url: string };
};

export type PokemonStat = {
  base_stat: number;
  effort: number;
  stat: { name: string; url: string };
};

export type PokemonAbility = {
  ability: { name: string; url: string };
  is_hidden: boolean;
  slot: number;
};

export type PokemonSpecies = {
  name: string;
  flavor_text_entries: {
    flavor_text: string;
    language: { name: string };
    version: { name: string };
  }[];
  capture_rate: number;
  base_happiness: number;
  growth_rate: { name: string };
  egg_groups: { name: string }[];
  gender_rate: number;
  is_legendary: boolean;
  is_mythical: boolean;
  habitat: { name: string } | null;
  generation: { name: string };
};

export type PokemonDetail = {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  sprites: {
    front_default: string;
    other: {
      "official-artwork": { front_default: string };
    };
  };
};
