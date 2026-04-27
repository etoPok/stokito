import { View, Pressable, Text, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CardButton } from './../components/cardButton';
import { useState } from 'react';
import { useTypedNavigation } from '../types';
import { Menu, IconButton } from 'react-native-paper';
import { AppAccordion, appAccordionStyles } from './../components/appAccordion';
import { Inventory } from '../domain/inventory';
import { InventoryProduct } from '../domain/inventoryProduct';
import { useInventories } from '../hooks/inventoryContext';
import repository from '../services/repositories';
import { Grid } from '../components/grid';
import { useStyles } from '../hooks/useStyles';
import { AppTheme } from '../theme/themes';
import { Header } from '../components/header';
import { useAppTheme } from '../hooks/useAppTheme';
import { createPickerRequest } from '../services/pickerService';
import { Product } from '../domain/product';
import { v4 as uuid } from 'uuid';

export function InventoriesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useTypedNavigation<'InventoryScreen'>();
  const { inventories, removeInventory } = useInventories();
  const styles = useStyles(createStyles);
  const { theme } = useAppTheme();

  const [inventoryProducts, setInventoryProducts] = useState<
    InventoryProduct[]
  >([]);

  const [visible, setVisible] = useState(false);
  const [deleteInventory, setDeleteInventory] = useState<boolean>(false);
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(
    null
  );

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

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
      <Header
        title="Inventarios"
        goBack={navigation.goBack}
        rightSide={
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <IconButton
                icon="dots-horizontal"
                size={24}
                onPress={openMenu}
                iconColor={theme.textPrimary}
              />
            }
            contentStyle={styles.popupMenuButton}
          >
            <Menu.Item
              onPress={() => {
                setVisible(false);
                navigation.navigate('InventoryProductScreen', {
                  inventoryProduct: undefined,
                });
              }}
              title="Crear producto de inventario"
              titleStyle={styles.popupOptionText}
            />
            <Menu.Item
              onPress={async () => {
                setVisible(false);
                navigation.navigate('ProductsScreen', {
                  type: 'single-pick',
                  pickerKey: 'order:product',
                });
                const p = await createPickerRequest<Product>('order:product');
                if (p) {
                  navigation.navigate('InventoryProductScreen', {
                    inventoryProduct: {
                      ...p,
                      ...{
                        id: uuid(),
                        productId: p.id,
                        stock: undefined,
                        inventory: undefined,
                      },
                    },
                  });
                }
              }}
              title="Agregar producto a inventario"
              titleStyle={styles.popupOptionText}
            />
            <Menu.Item
              onPress={() => {
                setVisible(false);
                navigation.navigate('InventoryScreen', {
                  inventory: undefined,
                });
              }}
              title="Crear inventario"
              titleStyle={styles.popupOptionText}
            />
            <Menu.Item
              onPress={() => {
                setDeleteInventory(true);
                setVisible(false);
              }}
              title="Eliminar inventario"
              titleStyle={styles.popupOptionText}
            />
          </Menu>
        }
      ></Header>

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
                      const results = await repository.getInventoryProducts(
                        inv.id
                      );
                      setInventoryProducts(results);
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

      <Grid
        data={inventoryProducts}
        keyExtractor={(item) => item.id!}
        breakpoints={{ xs: 3, sm: 4, md: 4, lg: 5 }}
        renderItem={(item, _) => (
          <CardButton
            title={item.name}
            imageSource={require('../assets/favicon.png')}
            onPress={() => {
              navigation.navigate('InventoryProductScreen', {
                inventoryProduct: item,
              });
            }}
          />
        )}
      />
    </View>
  );
}

const createStyles = (theme: AppTheme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },

  flatlistOptions: {
    paddingHorizontal: 12,
  },
  actionsContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 14,
  } satisfies ViewStyle,
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  } satisfies ViewStyle,
  cardWrapper: {
    width: '48%',
    marginBottom: 16,
  } satisfies ViewStyle,
  actionsRow: {
    marginTop: 6,
    gap: 6,
  },
  deleteProduct: {
    backgroundColor: '#7F1D1D',
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  } satisfies ViewStyle,
  deleteInventory: {
    backgroundColor: '#991B1B',
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  } satisfies ViewStyle,
  actionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  } satisfies TextStyle,

  popupMenuButton: {
    backgroundColor: theme.background,
  },
  popupOptionText: {
    color: theme.textPrimary,
  },
});
