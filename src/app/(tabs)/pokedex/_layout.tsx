import { Stack } from "expo-router";

export default function PokedexLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#CC0000" },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Pokédex" }} />
      <Stack.Screen name="[id]" options={{ title: "Details" }} />
    </Stack>
  );
}
