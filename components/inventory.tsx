import { View, FlatList, StyleSheet, Pressable, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CardButton } from './cardButton';
import { useProducts } from '../hooks/productContext';
import { useInventories } from '../hooks/inventoryContext';
import { useState } from 'react';
import {
  getAllInventories,
  getAllProducts,
  getInventoryProducts,
  removeInventory,
  removeProduct,
} from '../services/repositories';
import { useTypedNavigation } from '../types';
import { Menu, IconButton } from 'react-native-paper';
import { AppAccordion, appAccordionStyles } from './appAccordion';
import DomainInventory from '../domain/inventory';
import { Product } from '../domain/product';

export function Inventory() {
  const insets = useSafeAreaInsets();
  const navigation = useTypedNavigation<'Inventory'>();

  const { setProducts } = useProducts();
  const [inventoryProducts, setInventoryProducts] = useState<Product[]>([]);
  const { inventories, setInventories } = useInventories();

  const [visible, setVisible] = useState(false);
  const [deleteInventory, setDeleteInventory] = useState<boolean>(false);
  const [selectedInventory, setSelectedInventory] =
    useState<DomainInventory | null>(null);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

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

        <Text style={styles.headerTitle}>Inventario</Text>

        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <IconButton icon="dots-horizontal" size={24} onPress={openMenu} />
          }
          contentStyle={{ backgroundColor: 'black' }}
        >
          <Menu.Item
            onPress={() => {
              setVisible(false);
              navigation.navigate('AddInventory');
            }}
            title="Agregar inventario"
            titleStyle={{ color: 'white' }}
          />
          <Menu.Item
            onPress={() => {
              setVisible(false);
              navigation.navigate('AddProductToInventory');
            }}
            title="Agregar producto"
            titleStyle={{ color: 'white' }}
          />
          <Menu.Item
            onPress={() => {
              setDeleteInventory(true);
              setVisible(false);
            }}
            title="Eliminar inventario"
            titleStyle={{ color: 'white' }}
          />
        </Menu>
      </View>

      {!deleteInventory ? (
        <AppAccordion
          buttonContainerStyle={appAccordionStyles.buttonContainer}
          buttonStyle={appAccordionStyles.button}
          titleStyle={appAccordionStyles.buttonText}
          title={
            selectedInventory != null
              ? selectedInventory.name
              : 'Seleccionar Inventario'
          }
        >
          {({ sendExpandedValue }) => (
            <View style={appAccordionStyles.dropdown}>
              {inventories.map((inv, index) => (
                <Pressable
                  style={appAccordionStyles.item}
                  key={index}
                  onPress={async () => {
                    try {
                      const productsObtained = await getInventoryProducts(
                        inv.id
                      );
                      setInventoryProducts(productsObtained);
                      setSelectedInventory(inv);
                      sendExpandedValue(false);
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                >
                  <Text style={appAccordionStyles.itemText}>{inv.name}</Text>
                  <Text style={appAccordionStyles.itemDetailText}>
                    {inv.location}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </AppAccordion>
      ) : (
        <AppAccordion
          buttonContainerStyle={appAccordionStyles.buttonContainer}
          buttonStyle={appAccordionStyles.button}
          titleStyle={[appAccordionStyles.buttonText, { color: 'red' }]}
          title="Cancelar eliminación"
          onPress={() => setDeleteInventory(false)}
          expand={deleteInventory}
        >
          {({ sendExpandedValue }) => (
            <View style={appAccordionStyles.dropdown}>
              {inventories.map((inv, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <View>
                    <Text style={appAccordionStyles.itemText}>{inv.name}</Text>
                    <Text style={appAccordionStyles.itemDetailText}>
                      {inv.location}
                    </Text>
                  </View>
                  <IconButton
                    icon={'delete'}
                    onPress={async () => {
                      try {
                        await removeInventory(inv.id);
                        const newInventories = await getAllInventories();
                        setInventories(newInventories);
                        setDeleteInventory(false);
                        setSelectedInventory(null);
                        sendExpandedValue(false);
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                  ></IconButton>
                </View>
              ))}
            </View>
          )}
        </AppAccordion>
      )}

      <FlatList
        contentContainerStyle={styles.listContent}
        data={inventoryProducts}
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
                    await removeProduct(item.id!);
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
  deleteInventory: {
    backgroundColor: '#991B1B',
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
