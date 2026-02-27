import {
  Pressable,
  Image,
  Text,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";

type CardButtonProps = {
  title?: string;
  imageSource: any;
  onPress: (event: GestureResponderEvent) => void;
};

export function CardButton({ title, imageSource, onPress }: CardButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Image source={imageSource} style={styles.image} />
      {title && <Text style={styles.title}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    backgroundColor: "grey",
    overflow: "hidden",
    elevation: 3, // Android
    shadowColor: "#000", // iOS
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  pressed: {
    opacity: 0.8,
  },
  image: {
    width: "100%",
    height: 120,
  },
  title: {
    padding: 12,
    fontSize: 18,
    fontWeight: "600",
  },
});
