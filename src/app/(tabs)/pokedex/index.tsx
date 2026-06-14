import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { useCallback, useEffect, useState } from "react";
import {
  fetchPokemonList,
  getPokemonSprite,
  type PokemonListItem,
} from "../../../lib/pokemonApi";

const LIMIT = 20;

export default function PokedexScreen() {
  const router = useRouter();
  const [pokemons, setPokemons] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const load = useCallback(async (offset: number) => {
    const result = await fetchPokemonList(offset, LIMIT);
    setPokemons((prev) => [...prev, ...result.pokemons]);
    setHasMore(result.hasMore);
  }, []);

  useEffect(() => {
    load(0).finally(() => setLoading(false));
  }, [load]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    await load(pokemons.length);
    setLoadingMore(false);
  }, [loadingMore, hasMore, pokemons.length, load]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#CC0000" />
      </View>
    );
  }

  return (
    <FlatList
      data={pokemons}
      keyExtractor={(item) => String(item.id)}
      numColumns={2}
      contentContainerStyle={styles.list}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator color="#CC0000" style={styles.footer} />
        ) : null
      }
      renderItem={({ item }) => (
        <Pressable
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={() => router.push(`/(tabs)/pokedex/${item.id}`)}
        >
          <Image
            source={getPokemonSprite(item.id)}
            style={styles.sprite}
            contentFit="contain"
          />
          <Text style={styles.id}>#{String(item.id).padStart(3, "0")}</Text>
          <Text style={styles.name}>{item.name}</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: 8 },
  card: {
    flex: 1,
    margin: 6,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  cardPressed: { opacity: 0.7 },
  sprite: { width: 96, height: 96 },
  id: { fontSize: 12, color: "#999", marginTop: 4 },
  name: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
    marginTop: 2,
  },
  footer: { paddingVertical: 16 },
});
