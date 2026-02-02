import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function Sell() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "black",
        paddingBottom: insets.bottom,
        paddingTop: insets.top,
      }}
    >
      <Text style={{ color: "white" }}> Hi! Sell </Text>
    </View>
  );
}
