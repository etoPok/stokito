import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CardButton } from './../components/cardButton';
import { RootStackParamList, useTypedNavigation } from '../types';
import { useEffect } from 'react';
import { useInventories } from '../hooks/inventoryContext';
import { useProducts } from '../hooks/productContext';

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
    title: 'Inventarios',
    image: require('../assets/favicon.png'),
    route: 'InventoriesScreen',
    params: undefined,
  },
  {
    id: '2',
    title: 'Productos',
    image: require('../assets/favicon.png'),
    route: 'ProductsScreen',
    params: undefined,
  },
  {
    id: '3',
    title: 'Caja',
    image: require('../assets/favicon.png'),
    route: 'CheckoutScreen',
    params: undefined,
  },
  {
    id: '4',
    title: 'Ventas',
    image: require('../assets/favicon.png'),
    route: 'SalesScreen',
    params: undefined,
  },
];

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useTypedNavigation<'HomeScreen'>();
  const { pullProducts } = useProducts();
  const { pullInventories } = useInventories();
  useEffect(() => {
    (async () => {
      try {
        await pullInventories();
        await pullProducts();
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'black',
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
              if (item.params === undefined) {
                navigation.navigate(item.route);
              } else {
                navigation.navigate(item.route, item.params as never);
              }
            }}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  logoText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    paddingBottom: 24,
  },
  flatlistOptions: {
    paddingHorizontal: 12,
  },
});
