import { Text, View, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CustomCamera } from "./camera.android";

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
      <CustomCamera />
      <View style={styles.overlay}>
        <Text style={styles.text}>Escanear código QR</Text>
        <View style={styles.scanArea} />
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Confirmar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    padding: 24,
  },
  text: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 16,
    borderRadius: 8,
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "white",
    alignSelf: "center",
    marginTop: "30%",
    borderRadius: 12,
  },
});
