import { Text, View, TextInput, Switch, StyleSheet } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import { FormFieldsProps } from './entityForm';
import { HandleCode } from './handleCode';
import { useTypedNavigation } from '../types';
import { ProductCode } from '../domain/productCode';
import { CardCarousel } from './cardCarousel';
import { useEntityForm } from '../hooks/useEntityForm';
import { v4 as uuid } from 'uuid';
import { ensureCurrencyFormat, toUnits } from '../utils/price';
import { useState } from 'react';
import { Product } from '../domain/product';

export function ProductFormFields({ isNew }: FormFieldsProps) {
  const {
    control,
    formState: { errors },
    getValues,
  } = useFormContext<Product>();
  const { editableEntity } = useEntityForm();
  const navigation = useTypedNavigation<'ProductScreen'>();

  const [salePriceText, setSalePriceText] = useState<string>(
    ensureCurrencyFormat(getValues().salePrice)
  );
  const [costPriceText, setCostPriceText] = useState<string>(
    ensureCurrencyFormat(getValues().costPrice)
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
        {errors.description && (
          <Text style={styles.errorMessage}>{errors.description.message}</Text>
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
                      isPrimary: getValues().codes.length === 0,
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
