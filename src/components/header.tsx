import { Pressable, Text, TextStyle, View, ViewStyle } from 'react-native';
import { useStyles } from '../hooks/useStyles';
import { AppTheme } from '../theme/themes';

export function Header({
  title,
  goBack,
  rightSide,
}: {
  title: string;
  goBack: () => void;
  rightSide?: React.ReactElement;
}) {
  const styles = useStyles(createStyles);
  return (
    <View style={styles.header}>
      <View style={styles.leftSide}>
        <Pressable style={styles.headerButton} onPress={goBack}>
          <Text style={styles.headerButtonText}>← Volver</Text>
        </Pressable>
      </View>

      <Text style={styles.headerTitle}>{title}</Text>

      {rightSide && <View style={styles.rightSide}>{rightSide}</View>}
    </View>
  );
}

const createStyles = (theme: AppTheme) => ({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 30,
    marginBottom: 12,
  } satisfies ViewStyle,
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: theme.overlay,
  } satisfies ViewStyle,
  headerButtonText: {
    color: theme.accent,
    fontSize: 14,
  },
  headerTitle: {
    color: theme.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    alignSelf: 'center',
  } satisfies TextStyle,
  leftSide: {
    position: 'absolute',
    alignSelf: 'center',
    left: 10,
  } satisfies ViewStyle,
  rightSide: {
    position: 'absolute',
    alignSelf: 'center',
    right: 10,
  } satisfies ViewStyle,
});
