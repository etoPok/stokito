import {
  View,
  FlatList,
  Text,
  TextStyle,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CardButton } from './../components/cardButton';
import { RootStackParamList, useTypedNavigation } from '../types';
import { AppTheme } from '../theme/themes';
import { useStyles } from '../hooks/useStyles';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../hooks/useAppTheme';

// discriminated union
type OptionItem = {
  [K in keyof RootStackParamList]: {
    id: string;
    title: string;
    image: any;
    route: K;
    params: RootStackParamList[K];
  };
}[keyof RootStackParamList];

const options: OptionItem[] = [
  {
    id: '1',
    title: 'Productos',
    image: require('../assets/favicon.png'),
    route: 'ProductsScreen',
    params: { type: 'view' },
  },
  {
    id: '2',
    title: 'Caja',
    image: require('../assets/favicon.png'),
    route: 'CheckoutScreen',
    params: undefined,
  },
  // {
  //   id: '3',
  //   title: 'Ventas',
  //   image: require('../assets/favicon.png'),
  //   route: 'SalesScreen',
  //   params: undefined,
  // },
];

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useTypedNavigation<'HomeScreen'>();
  const styles = useStyles(createStyles);
  const { theme } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom,
          paddingTop: insets.top,
        },
      ]}
    >
      <View
        style={{
          flexDirection: 'row',
          paddingBottom: 28,
          justifyContent: 'space-between',
          paddingHorizontal: 18,
        }}
      >
        <Text style={styles.logoText}> Stokito </Text>
        <TouchableOpacity
          style={{ alignSelf: 'center' }}
          onPress={() => navigation.navigate('PreferencesScreen')}
        >
          <Ionicons
            name="settings-sharp"
            color={theme.textSecondary}
            size={26}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.flatlistOptions}
        contentContainerStyle={{
          justifyContent: 'center',
        }}
        data={options}
        keyExtractor={(item) => item.id}
        numColumns={1}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <CardButton
              title={item.title}
              imageSource={item.image}
              onPress={() => {
                if (item.params === undefined) {
                  navigation.navigate(item.route);
                } else {
                  navigation.navigate(item.route, item.params as never);
                }
              }}
            />
          </View>
        )}
      />
    </View>
  );
}

const createStyles = (theme: AppTheme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  } satisfies ViewStyle,
  logoText: {
    color: theme.textPrimary,
    fontSize: 32,
    fontWeight: 'bold',
  } satisfies TextStyle,
  flatlistOptions: {
    paddingHorizontal: 24,
  } satisfies ViewStyle,
  cardWrapper: {
    alignItems: 'stretch',
    height: 145,
    marginHorizontal: 4,
    paddingBottom: 8,
  } satisfies ViewStyle,
});
