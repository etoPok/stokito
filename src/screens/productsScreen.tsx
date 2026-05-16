import {
  Button,
  View,
  ActivityIndicator,
  Text,
  FlatList,
  Pressable,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CardButton } from './../components/cardButton';
import { useTypedNavigation, useTypedRoute } from '../types';
import { IconButton, Menu } from 'react-native-paper';
import { useCallback, useMemo, useState } from 'react';
import { Grid } from '../components/grid';
import { useStyles } from '../hooks/useStyles';
import { AppTheme } from '../theme/themes';
import { Header } from '../components/header';
import { useAppTheme } from '../hooks/useAppTheme';
import { useScreenMode } from '../hooks/usePickerHandler';
import { Product } from '../domain/product';
import { Inventory } from '../domain/inventory';
import { useInventories } from '../hooks/useInventory';
import { useProducts } from '../hooks/useProduct';
import { useInventoryProducts } from '../hooks/useInventoryProduct';
import { InventoryProduct } from '../domain/inventoryProduct';
import { createPickerRequest } from '../services/pickerService';

type SpecialFilter = 'no-inventory' | 'with-inventory';

type ActiveFilter =
  | { kind: 'special'; value: SpecialFilter }
  | { kind: 'inventory'; inventory: Inventory };

interface FilterChip {
  id: string;
  label: string;
  filter: ActiveFilter;
}

interface FilterBarProps {
  active: ActiveFilter;
  onSelect: (filter: ActiveFilter) => void;
  theme: AppTheme;
}

function FilterBar({ active, onSelect, theme }: FilterBarProps) {
  const {
    data: inventoryData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInventories();
  const inventories: Inventory[] =
    inventoryData?.pages.flatMap((p) => p.items) ?? [];

  const styles = useStyles(createStyles);

  const chips: FilterChip[] = [
    {
      id: 'no-inventory',
      label: 'Sin inventario',
      filter: { kind: 'special', value: 'no-inventory' },
    },
    {
      id: 'with-inventory',
      label: 'Con inventario',
      filter: { kind: 'special', value: 'with-inventory' },
    },
    ...inventories.map((inv) => ({
      id: inv.id,
      label: inv.name,
      filter: { kind: 'inventory' as const, inventory: inv },
    })),
  ];

  const isActive = useCallback(
    (chip: FilterChip): boolean => {
      if (active.kind === 'special' && chip.filter.kind === 'special') {
        return active.value === chip.filter.value;
      }
      if (active.kind === 'inventory' && chip.filter.kind === 'inventory') {
        return active.inventory.id === chip.filter.inventory.id;
      }
      return false;
    },
    [active]
  );

  return (
    <FlatList
      horizontal
      data={chips}
      style={{ flexGrow: 0 }}
      keyExtractor={(c) => c.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterBarContent}
      renderItem={({ item: chip }) => {
        const selected = isActive(chip);
        return (
          <Pressable
            onPress={() => onSelect(chip.filter)}
            style={[
              styles.chip,
              {
                backgroundColor: selected
                  ? theme.buttonPrimary
                  : (theme.overlay ?? theme.background),
                borderColor: selected
                  ? theme.buttonPrimary
                  : (theme.border ?? '#ccc'),
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                {
                  color: selected ? '#fff' : theme.textPrimary,
                  fontWeight: selected ? '600' : '400',
                },
              ]}
            >
              {chip.label}
            </Text>
          </Pressable>
        );
      }}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator
            size="small"
            style={styles.filterSpinner}
            color={theme.textPrimary}
          />
        ) : null
      }
    />
  );
}

function useFilteredItems(active: ActiveFilter) {
  const products = useProducts();
  const inventoryProducts = useInventoryProducts();

  return useMemo(() => {
    if (active.kind === 'special' && active.value === 'no-inventory') {
      const items: Product[] =
        products.data?.pages.flatMap((p) => p.items) ?? [];
      return {
        items,
        fetchNextPage: products.fetchNextPage,
        hasNextPage: products.hasNextPage,
        isFetchingNextPage: products.isFetchingNextPage,
        status: products.status,
      };
    }

    const allInvItems: InventoryProduct[] =
      inventoryProducts.data?.pages.flatMap((p) => p.items) ?? [];

    const items =
      active.kind === 'inventory'
        ? allInvItems.filter(
            (ip) => ip.inventoryStock.inventory.id === active.inventory.id
          )
        : allInvItems;

    return {
      items,
      fetchNextPage: inventoryProducts.fetchNextPage,
      hasNextPage: inventoryProducts.hasNextPage,
      isFetchingNextPage: inventoryProducts.isFetchingNextPage,
      status: inventoryProducts.status,
    };
  }, [active, products, inventoryProducts]);
}

export function ProductsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useTypedNavigation<'ProductsScreen'>();
  const styles2 = useStyles(createStyles);
  const { theme } = useAppTheme();
  const [visible, setVisible] = useState<boolean>(false);

  const [activeFilter, setActiveFilter] = useState<ActiveFilter>({
    kind: 'special',
    value: 'no-inventory',
  });
  const { items, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useFilteredItems(activeFilter);

  const mode = useTypedRoute<'ProductsScreen'>().params ?? { type: 'view' };
  const {
    isViewMode,
    isPickerMode,
    isMultiPick,
    handleItemPress,
    confirmMultiPick,
    cancel,
    selectedItems,
  } = useScreenMode<Product | InventoryProduct, 'ProductsScreen'>({
    mode,
    navigation,
  });

  if (status === 'pending') return <ActivityIndicator size={'small'} />;
  if (status === 'error') return <Text>Error al cargar datos</Text>;

  return (
    <View
      style={[
        styles2.container,
        { paddingBottom: insets.bottom, paddingTop: insets.top },
      ]}
    >
      <Header
        title="Productos"
        goBack={isPickerMode ? cancel : navigation.goBack}
        rightSide={
          isViewMode ? (
            <Menu
              visible={visible}
              onDismiss={() => setVisible(false)}
              anchor={
                <IconButton
                  icon="dots-horizontal"
                  size={24}
                  onPress={() => setVisible(true)}
                  iconColor={theme.textPrimary}
                />
              }
              contentStyle={styles2.popupMenuButton}
            >
              <Menu.Item
                onPress={() => {
                  setVisible(false);
                  navigation.navigate('ProductScreen', { product: undefined });
                }}
                title="Crear producto"
                titleStyle={styles2.popupOptionText}
              />
              <Menu.Item
                onPress={() => {
                  setVisible(false);
                  navigation.navigate('InventoryProductScreen', {
                    inventoryProduct: undefined,
                  });
                }}
                title="Crear producto de inventario"
                titleStyle={styles2.popupOptionText}
              />
              <Menu.Item
                onPress={() => {
                  setVisible(false);
                  navigation.navigate('InventoryScreen', {
                    inventory: undefined,
                  });
                }}
                title="Crear inventario"
                titleStyle={styles2.popupOptionText}
              />
              <Menu.Item
                onPress={async () => {
                  setVisible(false);
                  const pickerKey = 'order:product';
                  navigation.navigate('ProductsScreen', {
                    type: 'single-pick',
                    pickerKey: pickerKey,
                  });
                  const p = await createPickerRequest<Product>(pickerKey);
                  if (p) {
                    navigation.navigate('InventoryProductScreen', {
                      inventoryProduct: {
                        ...p,
                        ...{
                          productId: p.id,
                          inventoryStock: {
                            id: '',
                            stock: 0,
                            createdAt: '',
                            inventory: {
                              id: '',
                              name: '',
                              location: '',
                              createdAt: '',
                            },
                          },
                        },
                      },
                    });
                  }
                }}
                title="Agregar producto a inventario"
                titleStyle={styles2.popupOptionText}
              />
            </Menu>
          ) : isMultiPick ? (
            <Button
              title={`Confirmar (${selectedItems.length})`}
              onPress={confirmMultiPick}
              disabled={selectedItems.length === 0}
            />
          ) : undefined
        }
      />

      <FilterBar
        active={activeFilter}
        onSelect={setActiveFilter}
        theme={theme}
      />

      <Grid
        data={items}
        keyExtractor={(item) => item.id!}
        breakpoints={{ xs: 3, sm: 4, md: 4, lg: 5 }}
        renderItem={(item) => {
          return (
            <CardButton
              title={item.name}
              imageSource={require('../assets/favicon.png')}
              onPress={() => {
                if (!isViewMode) {
                  handleItemPress(item as Product);
                  return;
                }

                if (activeFilter.kind === 'inventory') {
                  navigation.navigate('InventoryProductScreen', {
                    inventoryProduct: item as InventoryProduct,
                  });
                } else {
                  navigation.navigate('ProductScreen', {
                    product: item as Product,
                  });
                }
              }}
            />
          );
        }}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={{ paddingVertical: 24, alignItems: 'center' }}>
              <ActivityIndicator size="small" />
            </View>
          ) : hasNextPage ? (
            <View style={{ height: 40 }} />
          ) : (
            <View style={{ paddingVertical: 24, alignItems: 'center' }}>
              <Text style={{ color: '#999', fontSize: 13 }}>
                {activeFilter.kind === 'special' &&
                activeFilter.value === 'no-inventory'
                  ? 'No hay más productos'
                  : 'No hay más items'}
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}

const createStyles = (theme: AppTheme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  popupMenuButton: {
    backgroundColor: theme.background,
  },
  popupOptionText: {
    color: theme.textPrimary,
  },
  filterBarContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  chipText: {
    fontSize: 13,
  },
  filterSpinner: {
    marginHorizontal: 12,
    alignSelf: 'center',
  } satisfies ViewStyle,
});
