import { Text, View, TextInput, Switch, StyleSheet } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import { Product } from '../domain/product';
import { FormFieldsProps } from './entityForm';
import { HandleCode } from './handleCode';
import { useTypedNavigation } from '../types';
import { ProductCode } from '../domain/productCode';
import { CardCarousel } from './cardCarousel';
import { useEntityForm } from '../hooks/entityFormContext';
import { v4 as uuid } from 'uuid';

export type ProductFormFieldsType = {
  product: Product;
  productCode: ProductCode[];
};

export function ProductFormFields({ isNew }: FormFieldsProps) {
  const {
    control,
    formState: { errors },
    getValues,
  } = useFormContext<ProductFormFieldsType>();
  const { editableEntity } = useEntityForm();
  const navigation = useTypedNavigation<'ProductScreen'>();

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <Controller
          control={control}
          name="product.name"
          render={({ field: { onChange } }) => (
            <>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={getValues().product.name}
                placeholder="Nombre del producto"
                placeholderTextColor="#777"
                onChangeText={(text) => onChange(text)}
                editable={editableEntity}
              />
            </>
          )}
        />
        {errors.product?.name && (
          <Text style={{ color: 'red' }}>{errors.product.name.message}</Text>
        )}
      </View>

      <View style={styles.field}>
        <Controller
          control={control}
          name="product.costPrice"
          render={({ field: { onChange } }) => (
            <>
              <Text style={styles.label}>Costo de producto</Text>
              <TextInput
                style={styles.input}
                value={
                  getValues().product.costPrice !== undefined
                    ? String(getValues().product.costPrice)
                    : undefined
                }
                keyboardType="numeric"
                placeholder="Precio"
                placeholderTextColor="#777"
                onChangeText={(text) => onChange(text)}
                editable={editableEntity}
              />
            </>
          )}
        />
        {errors.product?.costPrice && (
          <Text style={{ color: 'red' }}>
            {errors.product.costPrice.message}
          </Text>
        )}
      </View>

      <View style={styles.field}>
        <Controller
          control={control}
          name="product.salePrice"
          render={({ field: { onChange } }) => (
            <>
              <Text style={styles.label}>Precio de venta</Text>
              <TextInput
                style={styles.input}
                value={
                  getValues().product.salePrice !== undefined
                    ? String(getValues().product.salePrice)
                    : undefined
                }
                keyboardType="numeric"
                placeholder="Precio"
                placeholderTextColor="#777"
                onChangeText={(text) => onChange(text)}
                editable={editableEntity}
              />
            </>
          )}
        />
        {errors.product?.salePrice && (
          <Text style={{ color: 'red' }}>
            {errors.product.salePrice.message}
          </Text>
        )}
      </View>

      <View style={styles.field}>
        <Controller
          control={control}
          name="product.description"
          render={({ field: { onChange } }) => (
            <>
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.multiline]}
                value={getValues().product.description}
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

      {!isNew && (
        <View style={styles.switchRow}>
          <Controller
            control={control}
            name="product.isDiscontinued"
            render={({ field: { onChange } }) => (
              <>
                <Text style={styles.label}>Descontinuado</Text>
                <Switch
                  value={getValues().product.isDiscontinued}
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
        <Text style={{ color: 'red' }}>{errors.productCode.message}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  barcodeContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
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
  footer: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  saveButton: {
    backgroundColor: '#4da6ff',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  barcodeConstainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
});
