import { Stack } from "expo-router";

export default function FavoritesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#CC0000" },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Favorites" }} />
    </Stack>
  );
}
