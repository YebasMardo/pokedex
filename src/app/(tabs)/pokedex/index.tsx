import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";

export default function PokedexScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        style={{
          fontSize: 15,
          marginBottom: 15,
        }}
      >
        Pokédex
      </Text>
      <Pressable
        onPress={() => router.push("/(tabs)/pokedex/1")}
        style={({ pressed }) => ({
          backgroundColor: pressed ? "#AA0000" : "#CC0000",
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 8,
        })}
      >
        <Text style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: 16 }}>
          View Details
        </Text>
      </Pressable>
    </View>
  );
}
