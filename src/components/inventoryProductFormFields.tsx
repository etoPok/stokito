import {
  Text,
  View,
  TextInput,
  Switch,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import { AppAccordion, appAccordionStyles } from './appAccordion';
import { InventoryProduct } from '../domain/inventoryProduct';
import { FormFieldsProps } from './entityForm';
import { useInventories } from '../hooks/inventoryContext';
import { useTypedNavigation } from '../types';
import { ProductCode } from '../domain/productCode';
import { useEntityForm } from '../hooks/entityFormContext';
import { CardCarousel } from './cardCarousel';
import { HandleCode } from './handleCode';
import { v4 as uuid } from 'uuid';

export type InventoryProductFormFieldType = {
  inventoryProduct: InventoryProduct;
  productCode: ProductCode[];
};

export function InventoryProductFormFields({
  editable,
  isNew,
}: FormFieldsProps) {
  const {
    control,
    formState: { errors },
    getValues,
  } = useFormContext<InventoryProductFormFieldType>();
  const { editableEntity } = useEntityForm();
  const { inventories } = useInventories();
  const navigation = useTypedNavigation<'InventoryProductScreen'>();

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <Controller
          control={control}
          name="inventoryProduct.name"
          render={({ field: { onChange } }) => (
            <>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={getValues().inventoryProduct.name}
                placeholder="Nombre del producto"
                placeholderTextColor="#777"
                onChangeText={(text) => onChange(text)}
                editable={editable}
              />
            </>
          )}
        />
        {errors.inventoryProduct?.name && (
          <Text style={styles.errorMessage}>
            {errors.inventoryProduct.name.message}
          </Text>
        )}
      </View>

      <View style={styles.field}>
        <Controller
          control={control}
          name="inventoryProduct.costPrice"
          render={({ field: { onChange } }) => (
            <>
              <Text style={styles.label}>Costo de producto</Text>
              <TextInput
                style={styles.input}
                value={
                  getValues().inventoryProduct.costPrice !== undefined
                    ? String(getValues().inventoryProduct.costPrice)
                    : undefined
                }
                keyboardType="numeric"
                placeholder="Precio"
                placeholderTextColor="#777"
                onChangeText={(text) => onChange(text)}
                editable={editable}
              />
            </>
          )}
        />
        {errors.inventoryProduct?.costPrice && (
          <Text style={styles.errorMessage}>
            {errors.inventoryProduct.costPrice.message}
          </Text>
        )}
      </View>

      <View style={styles.field}>
        <Controller
          control={control}
          name="inventoryProduct.salePrice"
          render={({ field: { onChange } }) => (
            <>
              <Text style={styles.label}>Precio de venta</Text>
              <TextInput
                style={styles.input}
                value={
                  getValues().inventoryProduct.salePrice !== undefined
                    ? String(getValues().inventoryProduct.salePrice)
                    : undefined
                }
                keyboardType="numeric"
                placeholder="Precio"
                placeholderTextColor="#777"
                onChangeText={(text) => onChange(text)}
                editable={editable}
              />
            </>
          )}
        />
        {errors.inventoryProduct?.salePrice && (
          <Text style={styles.errorMessage}>
            {errors.inventoryProduct.salePrice.message}
          </Text>
        )}
      </View>

      <View style={styles.field}>
        <Controller
          control={control}
          name="inventoryProduct.stok"
          render={({ field: { onChange } }) => (
            <>
              <Text style={styles.label}>Stock</Text>
              <TextInput
                style={styles.input}
                value={
                  getValues().inventoryProduct.stok !== undefined
                    ? String(getValues().inventoryProduct.stok)
                    : undefined
                }
                keyboardType="numeric"
                placeholder="Cantidad disponible"
                placeholderTextColor="#777"
                onChangeText={(text) => onChange(text)}
                editable={editable}
              />
            </>
          )}
        />
        {errors.inventoryProduct?.stok && (
          <Text style={styles.errorMessage}>
            {errors.inventoryProduct.stok.message}
          </Text>
        )}
      </View>

      <View style={styles.field}>
        <Controller
          control={control}
          name="inventoryProduct.description"
          render={({ field: { onChange } }) => (
            <>
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.multiline]}
                value={getValues().inventoryProduct.description}
                placeholder="Descripción del producto"
                placeholderTextColor="#777"
                onChangeText={(text) => onChange(text)}
                editable={editable}
                multiline
              />
            </>
          )}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Bodega</Text>
        <Controller
          control={control}
          name="inventoryProduct.inventory"
          render={({ field: { onChange } }) => (
            <AppAccordion
              title={
                getValues().inventoryProduct.inventory !== undefined
                  ? getValues().inventoryProduct.inventory!.name
                  : 'Seleccionar inventario'
              }
              titleStyle={appAccordionStyles.buttonText}
              buttonContainerStyle={appAccordionStyles.buttonContainer}
              buttonStyle={appAccordionStyles.button}
              disabled={!editable}
            >
              {({ sendExpandedValue }) => (
                <View style={appAccordionStyles.dropdown}>
                  {inventories.map((inv, index) => (
                    <Pressable
                      key={index}
                      style={appAccordionStyles.item}
                      onPress={() => {
                        onChange(inv);
                        sendExpandedValue(false);
                      }}
                    >
                      <Text style={appAccordionStyles.itemText}>
                        {inv.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </AppAccordion>
          )}
        />
        {errors.inventoryProduct?.inventory && (
          <Text style={styles.errorMessage}>
            {errors.inventoryProduct.inventory.message}
          </Text>
        )}
      </View>

      {!isNew && (
        <View style={styles.switchRow}>
          <Controller
            control={control}
            name="inventoryProduct.isDiscontinued"
            render={({ field: { onChange } }) => (
              <>
                <Text style={styles.label}>Descontinuado</Text>
                <Switch
                  value={getValues().inventoryProduct.isDiscontinued}
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
        name="productCode"
        render={({ field: { onChange } }) => (
          <CardCarousel
            data={getValues().productCode}
            renderItem={(item: ProductCode | null) => (
              <HandleCode
                navigation={navigation}
                code={item?.code}
                handle={editableEntity}
                handleChange={(code, codeType) => {
                  if (getValues().productCode.length === 0) {
                    onChange([
                      ...getValues().productCode,
                      {
                        id: uuid(),
                        code: code,
                        codeType: codeType,
                        isPrimary: true,
                      } satisfies ProductCode,
                    ]);
                    return;
                  }
                  if (item == null) return;
                  item.code = code;
                  item.codeType = codeType;
                  onChange([...getValues().productCode]);
                }}
                handleAdd={(code, codeType) => {
                  onChange([
                    ...getValues().productCode,
                    {
                      id: uuid(),
                      code: code,
                      codeType: codeType,
                      isPrimary: getValues().productCode.length === 0,
                    } satisfies ProductCode,
                  ]);
                }}
                handleRemove={() => {
                  const newProductCode = getValues().productCode.filter(
                    (pc) => pc.id !== item?.id
                  );
                  if (newProductCode) onChange(newProductCode);
                }}
              />
            )}
          />
        )}
      />
      {errors.productCode && (
        <Text style={styles.errorMessage}>{errors.productCode.message}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  errorMessage: {
    color: 'red',
  },
});
