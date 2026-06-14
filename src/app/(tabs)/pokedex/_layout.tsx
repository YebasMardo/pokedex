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
      <Stack.Screen name="[id]" options={{ title: "Details", headerShown: false }} />
      <Stack.Screen
        name="species"
        options={{
          presentation: "formSheet",
          sheetAllowedDetents: [0.6, 1],
          sheetInitialDetentIndex: 0,
          sheetGrabberVisible: true,
          headerShown: false,
        }}
      />
    </Stack>
  );
}
