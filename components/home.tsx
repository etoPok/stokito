import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CardButton } from './cardButton';
import { RootStackParamList, useTypedNavigation } from '../types';
import { useEffect } from 'react';
import { useInventories } from '../hooks/inventoryContext';
import { useProducts } from '../hooks/productContext';
import { getAllInventories, getAllProducts } from '../services/repositories';

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
    route: 'Inventory',
    params: undefined,
  },
  {
    id: '2',
    title: 'Productos',
    image: require('../assets/favicon.png'),
    route: 'Products',
    params: undefined,
  },
  {
    id: '3',
    title: 'Caja',
    image: require('../assets/favicon.png'),
    route: 'Checkout',
    params: undefined,
  },
  {
    id: '4',
    title: 'Ventas',
    image: require('../assets/favicon.png'),
    route: 'Sales',
    params: undefined,
  },
];

export function Home() {
  const insets = useSafeAreaInsets();
  const navigation = useTypedNavigation<'Home'>();
  const { setProducts } = useProducts();
  const { setInventories } = useInventories();
  useEffect(() => {
    console.log('effect start');
    let active = true;
    getAllInventories().then((inventories) => {
      console.log('query resolved inventories', active);
      if (active) setInventories(inventories);
    });
    getAllProducts().then((products) => {
      console.log('query resolved products', active);
      if (active) setProducts(products);
    });
    return () => {
      console.log('cleanup');
      active = false;
    };
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
                navigation.navigate(item.route, item.params);
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
