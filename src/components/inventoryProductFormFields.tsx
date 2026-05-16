import {
  Text,
  View,
  TextInput,
  Switch,
  Pressable,
  FlatList,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import { InventoryProduct } from '../domain/inventoryProduct';
import { FormFieldsProps } from './entityForm';
import { useTypedNavigation } from '../types';
import { ProductCode } from '../domain/productCode';
import { useEntityForm } from '../hooks/useEntityForm';
import { CardCarousel } from './cardCarousel';
import { HandleCode } from './handleCode';
import { v4 as uuid } from 'uuid';
import { useState } from 'react';
import { ensureCurrencyFormat, toUnits } from '../utils/price';
import { useInventories } from '../hooks/useInventory';
import { Inventory } from '../domain/inventory';
import { useAppTheme } from '../hooks/useAppTheme';
import { AppTheme } from '../theme/themes';
import { useStyles } from '../hooks/useStyles';

export function InventoryProductFormFields({ isNew }: FormFieldsProps) {
  const {
    control,
    formState: { errors },
    getValues,
  } = useFormContext<InventoryProduct>();
  const { editableEntity } = useEntityForm();
  const navigation = useTypedNavigation<'InventoryProductScreen'>();
  const { theme } = useAppTheme();
  const styles = useStyles(createStyles);

  const [salePriceText, setSalePriceText] = useState<string>(
    ensureCurrencyFormat(getValues().salePrice!)
  );
  const [costPriceText, setCostPriceText] = useState<string>(
    ensureCurrencyFormat(getValues().costPrice!)
  );

  const {
    data: inventoryData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInventories();
  const inventories: Inventory[] =
    inventoryData?.pages.flatMap((p) => p.items) ?? [];

  const [selectedInventory, setSelectedInventory] = useState<boolean>(
    getValues().inventoryStock?.inventory?.name.trim() !== ''
  );

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange } }) => (
            <>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={getValues().name}
                placeholder="Nombre del producto"
                placeholderTextColor="#777"
                onChangeText={(text) => onChange(text)}
                editable={editableEntity}
              />
            </>
          )}
        />
        {errors.name && (
          <Text style={styles.errorMessage}>{errors.name.message}</Text>
        )}
      </View>

      <View style={styles.field}>
        <Controller
          control={control}
          name="costPrice"
          render={({ field: { onChange } }) => (
            <>
              <Text style={styles.label}>Costo de producto</Text>
              <TextInput
                style={styles.input}
                value={costPriceText}
                keyboardType="numeric"
                placeholder="Precio"
                placeholderTextColor="#777"
                onChangeText={(text) => {
                  setCostPriceText(ensureCurrencyFormat(text));
                  onChange(toUnits(text));
                }}
                editable={editableEntity}
              />
            </>
          )}
        />
        {errors.costPrice && (
          <Text style={styles.errorMessage}>{errors.costPrice.message}</Text>
        )}
      </View>

      <View style={styles.field}>
        <Controller
          control={control}
          name="salePrice"
          render={({ field: { onChange } }) => (
            <>
              <Text style={styles.label}>Precio de venta</Text>
              <TextInput
                style={styles.input}
                value={salePriceText}
                keyboardType="numeric"
                placeholder="Precio"
                placeholderTextColor="#777"
                onChangeText={(text) => {
                  setSalePriceText(ensureCurrencyFormat(text));
                  onChange(toUnits(text));
                }}
                editable={editableEntity}
              />
            </>
          )}
        />
        {errors.salePrice && (
          <Text style={styles.errorMessage}>{errors.salePrice.message}</Text>
        )}
      </View>

      <View style={styles.field}>
        <Controller
          control={control}
          name="inventoryStock.stock"
          render={({ field: { onChange } }) => (
            <>
              <Text style={styles.label}>Stock</Text>
              <TextInput
                style={styles.input}
                value={
                  getValues().inventoryStock.stock !== undefined
                    ? String(getValues().inventoryStock.stock)
                    : undefined
                }
                keyboardType="numeric"
                placeholder="Cantidad disponible"
                placeholderTextColor="#777"
                onChangeText={(text) => onChange(Number(text))}
                editable={editableEntity}
              />
            </>
          )}
        />
        {errors.inventoryStock?.stock && (
          <Text style={styles.errorMessage}>
            {errors.inventoryStock.stock.message}
          </Text>
        )}
      </View>

      <View style={styles.field}>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange } }) => (
            <>
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.multiline]}
                value={getValues().description}
                placeholder="Descripción del producto"
                placeholderTextColor="#777"
                onChangeText={(text) => onChange(text)}
                editable={editableEntity}
                multiline
              />
            </>
          )}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Inventario</Text>

        <View style={styles.inventoryContainer}>
          <Controller
            control={control}
            name="inventoryStock.inventory"
            render={({ field: { onChange } }) =>
              inventories.length === 0 ? (
                <View style={styles.emptyInventoryState}>
                  <Text style={styles.emptyInventoryText}>
                    No hay inventarios disponibles
                  </Text>
                </View>
              ) : !selectedInventory ? (
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.inventoryListContent}
                  data={inventories}
                  style={{ flexGrow: 0 }}
                  keyExtractor={(c) => c.id}
                  renderItem={({ item: inv }) => {
                    return (
                      <Pressable
                        onPress={() => {
                          onChange(inv);
                          setSelectedInventory(true);
                        }}
                        style={({ pressed }) => [
                          styles.inventoryCard,
                          pressed && styles.inventoryCardPressed,
                        ]}
                      >
                        <View style={styles.inventoryDot} />

                        <Text
                          numberOfLines={1}
                          style={styles.inventoryCardText}
                        >
                          {inv.name}
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
              ) : (
                <Pressable
                  onPress={() => {
                    if (!editableEntity) return;
                    setSelectedInventory(false);
                    onChange(undefined);
                  }}
                  style={({ pressed }) => [
                    styles.selectedInventoryCard,
                    pressed && styles.inventoryCardPressed,
                  ]}
                >
                  <View style={styles.selectedInventoryBadge}>
                    <Text style={styles.selectedInventoryBadgeText}>
                      Seleccionado
                    </Text>
                  </View>

                  <Text style={styles.selectedInventoryText}>
                    {getValues().inventoryStock.inventory.name}
                  </Text>

                  <Text style={styles.changeInventoryText}>
                    Toca para cambiar
                  </Text>
                </Pressable>
              )
            }
          />
        </View>
        {errors.inventoryStock?.inventory && (
          <Text style={styles.errorMessage}>
            {errors.inventoryStock.inventory.message}
          </Text>
        )}
      </View>

      {!isNew && (
        <View style={styles.switchRow}>
          <Controller
            control={control}
            name="isDiscontinued"
            render={({ field: { onChange } }) => (
              <>
                <Text style={styles.label}>Descontinuado</Text>
                <Switch
                  value={getValues().isDiscontinued}
                  onValueChange={(value) => onChange(value)}
                  disabled={!editableEntity}
                />
              </>
            )}
          />
        </View>
      )}

      <Controller
        control={control}
        name="codes"
        render={({ field: { onChange } }) => (
          <CardCarousel
            data={getValues().codes}
            renderItem={(item: ProductCode | null) => (
              <HandleCode
                navigation={navigation}
                code={item?.code}
                handle={editableEntity}
                handleChange={(code, codeType) => {
                  if (getValues().codes.length === 0) {
                    onChange([
                      ...getValues().codes,
                      {
                        id: uuid(),
                        code: code,
                        codeType: codeType,
                        isPrimary: true,
                        createdAt: '',
                      } satisfies ProductCode,
                    ]);
                    return;
                  }
                  if (item == null) return;
                  item.code = code;
                  item.codeType = codeType;
                  onChange([...getValues().codes]);
                }}
                handleAdd={(code, codeType) => {
                  onChange([
                    ...getValues().codes,
                    {
                      id: uuid(),
                      code: code,
                      codeType: codeType,
                      isPrimary: Boolean(getValues().codes.length === 0),
                      createdAt: '',
                    } satisfies ProductCode,
                  ]);
                }}
                handleRemove={() => {
                  const newProductCode = getValues().codes.filter(
                    (pc) => pc.id !== item?.id
                  );
                  if (newProductCode) onChange(newProductCode);
                }}
              />
            )}
          />
        )}
      />
      {errors.codes && (
        <Text style={styles.errorMessage}>{errors.codes.message}</Text>
      )}
    </View>
  );
}

const createStyles = (theme: AppTheme) => ({
  container: {
    paddingHorizontal: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#111',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#222',
  },
  multiline: {
    height: 90,
    textAlignVertical: 'top',
  } satisfies TextStyle,
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  } satisfies ViewStyle,
  errorMessage: {
    color: 'red',
  } satisfies TextStyle,
  filterSpinner: {
    marginHorizontal: 12,
    alignSelf: 'center',
  } satisfies ViewStyle,
  inventoryContainer: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 18,
    padding: 14,
  },

  inventoryListContent: {
    paddingRight: 10,
  },

  inventoryCard: {
    minWidth: 120,
    maxWidth: 180,
    marginRight: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: theme.overlay,
    borderWidth: 1,
    borderColor: theme.border,
    justifyContent: 'center',
  } satisfies ViewStyle,

  inventoryCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  inventoryDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: theme.accent,
    marginBottom: 10,
  },

  inventoryCardText: {
    color: theme.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  } satisfies TextStyle,

  selectedInventoryCard: {
    backgroundColor: theme.accentSoft,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.accent,
  },

  selectedInventoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.accent,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 12,
  } satisfies ViewStyle,

  selectedInventoryBadgeText: {
    color: theme.textPrimary,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  } satisfies TextStyle,

  selectedInventoryText: {
    color: theme.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  } satisfies TextStyle,

  changeInventoryText: {
    color: theme.textSecondary,
    fontSize: 13,
  },

  emptyInventoryState: {
    paddingVertical: 18,
    justifyContent: 'center',
    alignItems: 'center',
  } satisfies ViewStyle,

  emptyInventoryText: {
    color: theme.textSecondary,
    fontSize: 14,
  },
});
