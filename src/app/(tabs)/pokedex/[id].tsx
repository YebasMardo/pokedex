import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function PokemonDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Pokémon #{id}</Text>
    </View>
  );
}
