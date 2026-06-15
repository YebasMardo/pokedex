import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useMemo, useState } from "react";
import {
  fetchPokemonList,
  getPokemonSprite,
  type PokemonListItem,
} from "../../../lib/pokemonApi";
import { useFavorites } from "../../../context/FavoritesContext";

const LIMIT = 150;

export default function PokedexScreen() {
  const router = useRouter();
  const [pokemons, setPokemons] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { isFavorite } = useFavorites();

  useEffect(() => {
    fetchPokemonList(0, LIMIT)
      .then((result) => setPokemons(result.pokemons))
      .finally(() => setLoading(false));
  }, []);

  const filteredPokemons = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return pokemons;
    return pokemons.filter((item) => item.name.toLowerCase().includes(query));
  }, [pokemons, search]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#CC0000" />
      </View>
    );
  }

  return (
    <FlatList
      data={filteredPokemons}
      keyExtractor={(item) => String(item.id)}
      numColumns={2}
      contentContainerStyle={styles.list}
      stickyHeaderIndices={[0]}
      ListHeaderComponent={
        <View style={styles.searchContainer}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search Pokémon"
            placeholderTextColor="#999"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.search}
          />
          {search.length > 0 && (
            <Pressable
              onPress={() => setSearch("")}
              style={styles.clearButton}
              hitSlop={8}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </Pressable>
          )}
        </View>
      }
      ListEmptyComponent={
        <Text style={styles.empty}>No Pokémon found</Text>
      }
      renderItem={({ item }) => {
        const favorite = isFavorite(item.id);
        return (
          <Pressable
            style={({ pressed }) => [
              styles.card,
              favorite && styles.cardFavorite,
              pressed && styles.cardPressed,
            ]}
            onPress={() => router.push(`/(tabs)/pokedex/${item.id}`)}
          >
            {favorite && (
              <View style={styles.favoriteBadge}>
                <Ionicons name="heart" size={14} color="#fff" />
              </View>
            )}
            <Image
              source={getPokemonSprite(item.id)}
              style={styles.sprite}
              contentFit="contain"
            />
            <Text style={styles.id}>#{String(item.id).padStart(3, "0")}</Text>
            <Text style={styles.name}>{item.name}</Text>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: 8 },
  searchContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 6,
    marginTop: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  search: {
    paddingHorizontal: 16,
    paddingRight: 40,
    paddingVertical: 10,
    fontSize: 16,
  },
  clearButton: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  empty: {
    textAlign: "center",
    marginTop: 32,
    color: "#999",
    fontSize: 14,
  },
  card: {
    flex: 1,
    margin: 6,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardPressed: { opacity: 0.7 },
  cardFavorite: {
    backgroundColor: "#fff0f0",
    borderWidth: 1.5,
    borderColor: "#CC0000",
  },
  favoriteBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#CC0000",
    borderRadius: 10,
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  sprite: { width: 96, height: 96 },
  id: { fontSize: 12, color: "#999", marginTop: 4 },
  name: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
    marginTop: 2,
  },
});
