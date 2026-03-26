import { Text, View, TextInput, StyleSheet } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import { FormFieldsProps } from './entityForm';
import { Inventory } from '../domain/inventory';

export type InventoryFormFIeldsType = {
  inventory: Inventory;
};

export function InventoryFormFields({ editable }: FormFieldsProps) {
  const {
    control,
    formState: { errors },
    getValues,
  } = useFormContext<InventoryFormFIeldsType>();

  return (
    <>
      <View style={styles.field}>
        <Controller
          control={control}
          name="inventory.name"
          render={({ field: { onChange } }) => (
            <>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={getValues().inventory.name}
                placeholder="Nombre del producto"
                placeholderTextColor="#777"
                onChangeText={(text) => onChange(text)}
                editable={editable}
              />
            </>
          )}
        />
        {errors.inventory?.name && (
          <Text style={{ color: 'red' }}>{errors.inventory.name.message}</Text>
        )}
      </View>

      <View style={styles.field}>
        <Controller
          control={control}
          name="inventory.location"
          render={({ field: { onChange } }) => (
            <>
              <Text style={styles.label}>Ubicación</Text>
              <TextInput
                style={styles.input}
                value={getValues().inventory.location}
                placeholder="Ubicación de inventario"
                placeholderTextColor="#777"
                onChangeText={(text) => onChange(text)}
                editable={editable}
              />
            </>
          )}
        />
        {errors.inventory?.location && (
          <Text style={{ color: 'red' }}>
            {errors.inventory.location.message}
          </Text>
        )}
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
});
