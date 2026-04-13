import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppTheme } from '../theme/themes';
import { useStyles } from '../hooks/useStyles';
import { Header } from '../components/header';
import { useTypedNavigation } from '../types';
import { AppAccordion, appAccordionStyles } from '../components/appAccordion';
import { useAppTheme } from '../hooks/useAppTheme';

export function PreferencesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useTypedNavigation<'PreferencesScreen'>();
  const styles = useStyles(createStyles);
  const { isDark, toggleTheme } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <Header title="Preferencias" goBack={navigation.goBack}></Header>
      <AppAccordion
        title="Elegir Tema"
        titleStyle={appAccordionStyles.buttonText}
        buttonStyle={appAccordionStyles.button}
        buttonContainerStyle={appAccordionStyles.buttonContainer}
      >
        {({ sendExpandedValue }) => (
          <View style={appAccordionStyles.dropdown}>
            <TouchableOpacity
              onPress={() => {
                toggleTheme();
                sendExpandedValue(false);
              }}
              style={styles.accordionItem}
            >
              <Text style={styles.accordionItemText}>
                {isDark ? 'Tema Claro' : 'Tema Oscuro'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </AppAccordion>
    </View>
  );
}

const createStyles = (theme: AppTheme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  accordionItem: {
    padding: 10,
  },
  accordionItemText: {
    fontSize: 14,
    color: theme.textPrimary,
  },
});
