import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { fetchPokemonSpecies, type PokemonSpecies } from "../../../lib/pokemonApi";
import { TYPE_COLORS } from "../../../constants/pokemonTypes";

function cleanFlavorText(text: string): string {
  return text.replace(/[\n\f­]/g, " ").replace(/\s+/g, " ").trim();
}

function formatLabel(value: string): string {
  return value.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.tile}>
      <Text style={styles.tileLabel}>{label}</Text>
      <Text style={styles.tileValue}>{value}</Text>
    </View>
  );
}

function CaptureBar({ value, color }: { value: number; color: string }) {
  const pct = `${Math.round((value / 255) * 100)}%` as `${number}%`;
  return (
    <View style={styles.captureBarBg}>
      <View style={[styles.captureBarFill, { width: pct, backgroundColor: color }]} />
    </View>
  );
}

function GenderRow({ genderRate }: { genderRate: number }) {
  if (genderRate === -1) {
    return <Text style={styles.genderless}>Genderless</Text>;
  }
  const femalePct = (genderRate / 8) * 100;
  const malePct = 100 - femalePct;
  return (
    <View>
      <View style={styles.genderBar}>
        {malePct > 0 && (
          <View style={[styles.genderSegment, { flex: malePct, backgroundColor: "#6890F0" }]} />
        )}
        {femalePct > 0 && (
          <View style={[styles.genderSegment, { flex: femalePct, backgroundColor: "#F85888" }]} />
        )}
      </View>
      <View style={styles.genderLegend}>
        {malePct > 0 && <Text style={styles.maleText}>♂ {malePct}%</Text>}
        {femalePct > 0 && <Text style={styles.femaleText}>♀ {femalePct}%</Text>}
      </View>
    </View>
  );
}

export default function SpeciesScreen() {
  const { id, type } = useLocalSearchParams<{ id: string; type: string }>();
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPokemonSpecies(Number(id))
      .then(setSpecies)
      .finally(() => setLoading(false));
  }, [id]);

  const accentColor = TYPE_COLORS[type ?? ""] ?? "#888";

  if (loading || !species) {
    return (
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.centered}
      >
        {loading ? (
          <ActivityIndicator size="large" color={accentColor} />
        ) : (
          <Text style={styles.errorText}>Species data unavailable</Text>
        )}
      </ScrollView>
    );
  }

  const flavorEntry = species.flavor_text_entries.find(
    (e) => e.language.name === "en"
  );
  const flavorText = flavorEntry
    ? cleanFlavorText(flavorEntry.flavor_text)
    : null;
  const versionName = flavorEntry ? formatLabel(flavorEntry.version.name) : null;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { borderColor: accentColor }]}>
        <Text style={[styles.name, { color: accentColor }]}>
          {formatLabel(species.name)}
        </Text>
        <Text style={styles.number}>#{String(id).padStart(3, "0")}</Text>
      </View>

      {/* Badges */}
      {(species.is_legendary || species.is_mythical) && (
        <View style={styles.badgeRow}>
          {species.is_legendary && (
            <View style={[styles.badge, { backgroundColor: "#FAE078" }]}>
              <Text style={styles.badgeText}>★ Legendary</Text>
            </View>
          )}
          {species.is_mythical && (
            <View style={[styles.badge, { backgroundColor: "#F5AC78" }]}>
              <Text style={styles.badgeText}>✦ Mythical</Text>
            </View>
          )}
        </View>
      )}

      {/* Pokédex entry */}
      {flavorText && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: accentColor }]}>
            Pokédex Entry
          </Text>
          <View style={styles.flavorCard}>
            <Text style={styles.flavorText}>"{flavorText}"</Text>
            {versionName && (
              <Text style={styles.versionTag}>— {versionName}</Text>
            )}
          </View>
        </View>
      )}

      {/* Training */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: accentColor }]}>
          Training
        </Text>
        <View style={styles.tileGrid}>
          <InfoTile label="Growth Rate" value={formatLabel(species.growth_rate.name)} />
          <InfoTile
            label="Capture Rate"
            value={`${species.capture_rate} / 255`}
          />
        </View>
        <View style={styles.captureRow}>
          <Text style={styles.captureLabel}>Catch probability</Text>
          <CaptureBar value={species.capture_rate} color={accentColor} />
          <Text style={styles.capturePercent}>
            {Math.round((species.capture_rate / 255) * 100)}%
          </Text>
        </View>
        <View style={styles.tileGrid}>
          <InfoTile
            label="Base Happiness"
            value={`${species.base_happiness} / 255`}
          />
          <InfoTile
            label="Generation"
            value={formatLabel(species.generation.name).replace("Generation ", "Gen ")}
          />
        </View>
        {species.habitat && (
          <View style={styles.tileGrid}>
            <InfoTile label="Habitat" value={formatLabel(species.habitat.name)} />
            <View style={styles.tile} />
          </View>
        )}
      </View>

      {/* Breeding */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: accentColor }]}>
          Breeding
        </Text>
        <View style={styles.tileGrid}>
          {species.egg_groups.map((g) => (
            <InfoTile key={g.name} label="Egg Group" value={formatLabel(g.name)} />
          ))}
        </View>
        <Text style={styles.subLabel}>Gender Ratio</Text>
        <GenderRow genderRate={species.gender_rate} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 24, paddingTop: 8 },
  centered: { flexGrow: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "#CC0000", fontSize: 15 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
    borderBottomWidth: 2,
    marginBottom: 16,
  },
  name: { fontSize: 26, fontWeight: "bold" },
  number: { fontSize: 16, color: "#aaa", fontWeight: "600" },

  badgeRow: { flexDirection: "row", gap: 8, marginBottom: 20 },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  badgeText: { fontSize: 13, fontWeight: "700", color: "#444" },

  section: { marginBottom: 28 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 12,
  },

  flavorCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 16,
    padding: 16,
  },
  flavorText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 22,
    fontStyle: "italic",
  },
  versionTag: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 8,
    textAlign: "right",
  },

  tileGrid: { flexDirection: "row", gap: 10, marginBottom: 10 },
  tile: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 12,
  },
  tileLabel: { fontSize: 11, color: "#aaa", fontWeight: "600", marginBottom: 4 },
  tileValue: { fontSize: 14, fontWeight: "700", color: "#1a1a1a" },

  captureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  captureLabel: { fontSize: 12, color: "#aaa", width: 110 },
  capturePercent: { fontSize: 12, fontWeight: "700", color: "#333", width: 32, textAlign: "right" },
  captureBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: "#eee",
    borderRadius: 4,
    overflow: "hidden",
  },
  captureBarFill: { height: "100%", borderRadius: 4 },

  subLabel: { fontSize: 13, color: "#aaa", fontWeight: "600", marginBottom: 8 },
  genderBar: {
    flexDirection: "row",
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 6,
  },
  genderSegment: { height: "100%" },
  genderLegend: { flexDirection: "row", gap: 16 },
  maleText: { fontSize: 13, fontWeight: "600", color: "#6890F0" },
  femaleText: { fontSize: 13, fontWeight: "600", color: "#F85888" },
  genderless: { fontSize: 14, fontWeight: "600", color: "#aaa" },
});
