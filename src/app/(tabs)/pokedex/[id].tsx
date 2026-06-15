import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { fetchPokemonDetail, type PokemonDetail } from "../../../lib/pokemonApi";
import { TYPE_COLORS } from "../../../constants/pokemonTypes";
import { STAT_COLORS, STAT_LABELS } from "../../../constants/pokemonStats";
import { useFavorites } from "../../../context/FavoritesContext";

const SCREEN_HEIGHT = Dimensions.get("window").height;

function StatBar({ value, color }: { value: number; color: string }) {
  const pct = `${Math.round(Math.min((value / 255) * 100, 100))}%` as `${number}%`;
  return (
    <View style={styles.statBarBg}>
      <View style={[styles.statBarFill, { width: pct, backgroundColor: color }]} />
    </View>
  );
}

export default function PokemonDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    fetchPokemonDetail(Number(id))
      .then(setPokemon)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#CC0000" />
      </View>
    );
  }

  if (error || !pokemon) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error ?? "Pokémon not found"}</Text>
      </View>
    );
  }

  const primaryType = pokemon.types[0].type.name;
  const headerColor = TYPE_COLORS[primaryType] ?? "#888";
  const artwork =
    pokemon.sprites.other["official-artwork"].front_default ??
    pokemon.sprites.front_default;
  const displayName =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  return (
    <>
      <Stack.Screen
        options={{
          title: displayName,
          headerStyle: { backgroundColor: headerColor },
        }}
      />
      <View style={[styles.container, { backgroundColor: headerColor }]}>
        <ScrollView
          style={styles.scroll}
          contentInsetAdjustmentBehavior="never"
          showsVerticalScrollIndicator={true}
        >
          <View style={styles.header}>
            <View style={styles.headerInfo}>
              <Text style={styles.pokemonNumber}>
                #{String(pokemon.id).padStart(3, "0")}
              </Text>
              <Text style={styles.pokemonName}>{displayName}</Text>
              <View style={styles.typeRow}>
                {pokemon.types.map(({ type }) => (
                  <View key={type.name} style={styles.typeBadge}>
                    <Text style={styles.typeBadgeText}>{type.name}</Text>
                  </View>
                ))}
              </View>
            </View>
            <Image source={artwork} style={styles.artwork} contentFit="contain" />
            <Pressable
              style={styles.favoriteButton}
              onPress={() =>
                toggleFavorite({ id: pokemon.id, name: pokemon.name })
              }
              hitSlop={8}
            >
              <Ionicons
                name={isFavorite(pokemon.id) ? "heart" : "heart-outline"}
                size={28}
                color="#fff"
              />
            </Pressable>
          </View>

          <View style={styles.body}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoValue}>{pokemon.height / 10} m</Text>
                <Text style={styles.infoLabel}>Height</Text>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoItem}>
                <Text style={styles.infoValue}>{pokemon.weight / 10} kg</Text>
                <Text style={styles.infoLabel}>Weight</Text>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoItem}>
                <Text style={styles.infoValue}>{pokemon.base_experience}</Text>
                <Text style={styles.infoLabel}>Base XP</Text>
              </View>
            </View>

            <Text style={[styles.sectionTitle, { color: headerColor }]}>
              Abilities
            </Text>
            <View style={styles.abilitiesRow}>
              {pokemon.abilities.map(({ ability, is_hidden }) => (
                <View key={ability.name} style={styles.abilityChip}>
                  <Text style={styles.abilityText}>
                    {ability.name.replace(/-/g, " ")}
                    {is_hidden ? " ✦" : ""}
                  </Text>
                </View>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { color: headerColor }]}>
              Base Stats
            </Text>
            {pokemon.stats.map(({ stat, base_stat }) => (
              <View key={stat.name} style={styles.statRow}>
                <Text style={styles.statLabel}>
                  {STAT_LABELS[stat.name] ?? stat.name}
                </Text>
                <Text style={styles.statValue}>{base_stat}</Text>
                <StatBar
                  value={base_stat}
                  color={STAT_COLORS[stat.name] ?? headerColor}
                />
              </View>
            ))}

            <Pressable
              style={({ pressed }) => [
                styles.entryButton,
                { backgroundColor: headerColor, opacity: pressed ? 0.8 : 1 },
              ]}
              onPress={() =>
                router.push(
                  `/(tabs)/pokedex/species?id=${pokemon.id}&type=${primaryType}`
                )
              }
            >
              <Text style={styles.entryButtonText}>View Detailed Infos</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 16, color: "#CC0000" },

  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingTop: 50,
    paddingBottom: 50,
    paddingLeft: 24,
    paddingRight: 12,
    minHeight: 180,
  },
  favoriteButton: {
    position: "absolute",
    top: 50,
    right: 16,
  },
  headerInfo: { flex: 1, paddingBottom: 24 },
  pokemonNumber: {
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "600",
  },
  pokemonName: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 2,
  },
  typeRow: { flexDirection: "row", gap: 6, marginTop: 10 },
  typeBadge: {
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  typeBadgeText: {
    color: "#fff",
    fontWeight: "600",
    textTransform: "capitalize",
    fontSize: 13,
  },
  artwork: { width: 180, height: 180 },

  body: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    paddingTop: 28,
    paddingHorizontal: 24,
    paddingBottom: 40,
    minHeight: SCREEN_HEIGHT,
  },

  infoRow: {
    flexDirection: "row",
    backgroundColor: "#f8f8f8",
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 28,
  },
  infoItem: { flex: 1, alignItems: "center" },
  infoValue: { fontSize: 16, fontWeight: "bold", color: "#1a1a1a" },
  infoLabel: { fontSize: 12, color: "#aaa", marginTop: 2 },
  infoDivider: { width: 1, backgroundColor: "#e0e0e0", marginVertical: 4 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  abilitiesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 28,
  },
  abilityChip: {
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  abilityText: {
    fontSize: 14,
    fontWeight: "500",
    textTransform: "capitalize",
    color: "#444",
  },

  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  statLabel: {
    width: 60,
    fontSize: 12,
    fontWeight: "700",
    color: "#999",
  },
  statValue: {
    width: 36,
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textAlign: "right",
    marginRight: 10,
  },
  statBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: "#eee",
    borderRadius: 4,
    overflow: "hidden",
  },
  statBarFill: {
    height: "100%",
    borderRadius: 4,
  },

  entryButton: {
    marginTop: 24,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  entryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
