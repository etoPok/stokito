import { Button, View, FlatList, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import { Product } from "../domain/product";
import { CardButton } from "./cardButton";
import { HomeNavigationProp } from "../types";
import { useProducts } from "./productContext";

export function Inventory() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<HomeNavigationProp>();
  const { products } = useProducts();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "black",
        paddingBottom: insets.bottom,
        paddingTop: insets.top,
      }}
    >
      <Button title="Cambiar inventario" onPress={() => {}}></Button>
      <Button title="Agregar inventario" onPress={() => {}}></Button>
      <Button
        title="Agregar producto"
        onPress={() => {
          navigation.navigate("AddProduct");
        }}
      ></Button>
      <FlatList
        style={styles.flatlistOptions}
        data={products}
        keyExtractor={(item) => (item.sku != null ? item.sku : item.name)}
        numColumns={4}
        renderItem={({ item }) => (
          <CardButton
            title={item.name}
            imageSource={require("../assets/favicon.png")}
            onPress={() => {}}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flatlistOptions: {
    paddingHorizontal: 12,
  },
});
