import {
  Pressable,
  Image,
  Text,
  GestureResponderEvent,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useStyles } from '../hooks/useStyles';
import { AppTheme } from '../theme/themes';

type CardButtonProps = {
  title?: string;
  imageSource: any;
  onPress: (event: GestureResponderEvent) => void;
};

export function CardButton({ title, imageSource, onPress }: CardButtonProps) {
  const styles = useStyles(createStyles);

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

const createStyles = (theme: AppTheme) => ({
  card: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: theme.card,
    overflow: 'hidden',
  } satisfies ViewStyle,
  pressed: {
    opacity: 0.8,
  },
  image: {
    width: '100%',
    height: 90,
    backgroundColor: theme.border,
    borderRadius: 12,
  } satisfies ViewStyle,
  title: {
    color: theme.textPrimary,
    padding: 6,
    fontSize: 18,
    fontWeight: '600',
  } satisfies TextStyle,
});
