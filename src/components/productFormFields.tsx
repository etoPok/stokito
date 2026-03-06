import { Text, View, TextInput, Switch, StyleSheet } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import QRCode from 'react-native-qrcode-svg';
import { Product } from '../domain/product';
import { FormFieldsProps } from './entityForm';

export function ProductFormFields({ editable }: FormFieldsProps) {
  const {
    control,
    formState: { errors },
    getValues,
  } = useFormContext<Product>();

  return (
    <>
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
                editable={editable}
              />
            </>
          )}
        />
        {errors.name && (
          <Text style={{ color: 'red' }}>{errors.name.message}</Text>
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
                value={
                  getValues().costPrice !== undefined
                    ? String(getValues().costPrice)
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
        {errors.costPrice && (
          <Text style={{ color: 'red' }}>{errors.costPrice.message}</Text>
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
                value={
                  getValues().salePrice !== undefined
                    ? String(getValues().salePrice)
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
        {errors.salePrice && (
          <Text style={{ color: 'red' }}>{errors.salePrice.message}</Text>
        )}
      </View>

      <View style={styles.field}>
        <Controller
          control={control}
          name="sku"
          render={({ field: { onChange } }) => (
            <>
              <Text style={styles.label}>Código de producto (opcional)</Text>
              <TextInput
                style={styles.input}
                value={getValues().sku}
                placeholder="SKU o código interno"
                placeholderTextColor="#777"
                onChangeText={(text) => onChange(text)}
                editable={editable}
              />
            </>
          )}
        />
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
                editable={editable}
                multiline
              />
            </>
          )}
        />
      </View>

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
                disabled={!editable}
              />
            </>
          )}
        />
      </View>

      <View style={styles.qrPreviewContainer}>
        <View style={styles.qrBox}>
          <QRCode
            value={getValues().id}
            size={200}
            backgroundColor="black"
            color="white"
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
  qrPreviewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  qrBox: {
    width: 300,
    height: 300,
    backgroundColor: '#111',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#222',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
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
});
