import { View, FlatList, StyleSheet, Pressable, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { CardButton } from './cardButton';
import { HomeNavigationProp } from '../types';
import { useProducts } from '../hooks/productContext';
import { getAllProducts, removeProduct } from '../services/repositories';

export function Products() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<HomeNavigationProp>();
  const { products, setProducts } = useProducts();

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

        <View style={{ width: 60 }} />
      </View>

      <View style={styles.actionsContainer}>
        <Pressable
          style={styles.secondaryAction}
          onPress={() => navigation.navigate('AddProductDefinition')}
        >
          <Text style={styles.secondaryActionText}>Agregar producto</Text>
        </Pressable>
      </View>

      <FlatList
        contentContainerStyle={styles.listContent}
        data={products}
        keyExtractor={(item) => (item.sku != null ? item.sku : item.name)}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <CardButton
              title={item.name}
              imageSource={require('../assets/favicon.png')}
              onPress={() => {}}
            />
            <View style={styles.actionsRow}>
              <Pressable
                style={styles.deleteProduct}
                onPress={async () => {
                  try {
                    const deleted = await removeProduct(item.id!);
                    if (deleted) {
                      console.log('Remove product');
                    }
                    const newProducts = await getAllProducts();
                    setProducts(newProducts);
                  } catch (error) {
                    throw error;
                  }
                }}
              >
                <Text style={styles.actionText}>Eliminar producto</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flatlistOptions: {
    paddingHorizontal: 12,
  },
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
  actionsContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 14,
  },
  secondaryAction: {
    backgroundColor: '#1A1D24',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2F3A',
    marginBottom: 10,
  },
  secondaryActionText: {
    color: '#D1D5DB',
    fontSize: 15,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  container: {
    width: '100%',
  },
  actionsRow: {
    marginTop: 6,
    gap: 6,
  },
  deleteProduct: {
    backgroundColor: '#7F1D1D',
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});
