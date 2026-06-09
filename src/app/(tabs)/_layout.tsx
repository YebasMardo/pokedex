import { NativeTabs, Icon, Label, VectorIcon } from "expo-router/unstable-native-tabs";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function TabLayout() {
  return (
    <NativeTabs tintColor="#CC0000">
      <NativeTabs.Trigger name="pokedex">
        <Icon
          sf="list.bullet"
          androidSrc={<VectorIcon family={MaterialCommunityIcons} name="format-list-bulleted" />}
        />
        <Label>Pokédex</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="favorites">
        <Icon
          sf={{ default: "heart", selected: "heart.fill" }}
          androidSrc={<VectorIcon family={MaterialCommunityIcons} name="heart" />}
        />
        <Label>Favorites</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
