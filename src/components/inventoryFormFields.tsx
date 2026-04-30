import { Text, View, TextInput, StyleSheet } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import { useEntityForm } from '../hooks/useEntityForm';
import { Inventory } from '../domain/inventory';

export function InventoryFormFields() {
  const {
    control,
    formState: { errors },
    getValues,
  } = useFormContext<Inventory>();
  const { editableEntity } = useEntityForm();

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
          name="location"
          render={({ field: { onChange } }) => (
            <>
              <Text style={styles.label}>Ubicación</Text>
              <TextInput
                style={styles.input}
                value={getValues().location}
                placeholder="Ubicación de inventario"
                placeholderTextColor="#777"
                onChangeText={(text) => onChange(text)}
                editable={editableEntity}
              />
            </>
          )}
        />
        {errors?.location && (
          <Text style={styles.errorMessage}>{errors.location.message}</Text>
        )}
      </View>
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
