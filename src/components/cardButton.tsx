import {
  Pressable,
  Image,
  Text,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';

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
    borderRadius: 12,
    backgroundColor: 'grey',
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.8,
  },
  image: {
    width: '100%',
    height: 90,
    backgroundColor: '#5e5e5e',
    borderRadius: 12,
  },
  title: {
    padding: 6,
    fontSize: 18,
    fontWeight: '600',
  },
});
