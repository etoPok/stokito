import { View, FlatList, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import { CardButton } from "./cardButton";
import { RootStackParamList } from "../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// "Home" entrega contexto.
type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

type OptionItem = {
  id: string;
  title: string;
  image: any;
  route: keyof RootStackParamList;
};

const options: OptionItem[] = [
  {
    id: "1",
    title: "Venta",
    image: require("../assets/favicon.png"),
    route: "Sell",
  },
  {
    id: "2",
    title: "Rembolso",
    image: require("../assets/favicon.png"),
    route: "Refund",
  },
  {
    id: "3",
    title: "Inventario",
    image: require("../assets/favicon.png"),
    route: "Inventory",
  },
  {
    id: "4",
    title: "Caja",
    image: require("../assets/favicon.png"),
    route: "Checkout",
  },
];

export function Home() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<HomeNavigationProp>();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "black",
        paddingBottom: insets.bottom,
        paddingTop: insets.top,
      }}
    >
      <Text style={styles.logoText}> Stokito </Text>
      <FlatList
        style={styles.flatlistOptions}
        data={options}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <CardButton
            title={item.title}
            imageSource={item.image}
            onPress={() => {
              navigation.navigate(item.route);
            }}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  logoText: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    paddingBottom: 24,
  },
  flatlistOptions: {
    paddingHorizontal: 12,
  },
});
