import { View, StyleSheet, Pressable, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CardButton } from './../components/cardButton';
import { useProducts } from '../hooks/productContext';
import { useTypedNavigation } from '../types';
import { IconButton, Menu } from 'react-native-paper';
import { useState } from 'react';
import { Grid } from '../components/grid';

export function ProductsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useTypedNavigation<'ProductsScreen'>();
  const { products } = useProducts();

  const [visible, setVisible] = useState<boolean>(false);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'black',
        paddingBottom: insets.bottom,
        paddingTop: insets.top,
      }}
    >
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={styles.backText}>Volver</Text>
        </Pressable>

        <Text style={styles.headerTitle}>Productos</Text>

        <Menu
          visible={visible}
          onDismiss={() => setVisible(false)}
          anchor={
            <IconButton
              icon="dots-horizontal"
              size={24}
              onPress={() => setVisible(true)}
            />
          }
          contentStyle={{ backgroundColor: 'black' }}
        >
          <Menu.Item
            onPress={() => {
              setVisible(false);
              navigation.navigate('ProductScreen', { product: undefined });
            }}
            title="Agregar Producto"
            titleStyle={{ color: 'white' }}
          />
        </Menu>
      </View>

      <Grid
        data={products}
        keyExtractor={(item) => item.id!}
        breakpoints={{ xs: 3, sm: 4, md: 4, lg: 5 }}
        renderItem={(item, _) => (
          <CardButton
            title={item.name}
            imageSource={require('../assets/favicon.png')}
            onPress={() =>
              navigation.navigate('ProductScreen', { product: item })
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backText: {
    color: '#4da6ff',
    fontSize: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
