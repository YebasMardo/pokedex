import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { useFavorites } from "../../../context/FavoritesContext";
import { getPokemonSprite } from "../../../lib/pokemonApi";

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites } = useFavorites();

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item) => String(item.id)}
      numColumns={2}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <View style={styles.centered}>
          <Text style={styles.empty}>No favorites yet</Text>
        </View>
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
  centered: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 64 },
  list: { padding: 8, flexGrow: 1 },
  empty: { color: "#999", fontSize: 14 },
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
  sprite: { width: 96, height: 96 },
  id: { fontSize: 12, color: "#999", marginTop: 4 },
  name: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
    marginTop: 2,
  },
});
