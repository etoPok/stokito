import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Switch,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { HomeNavigationProp } from '../types';
import { Product } from '../domain/product';
import { useProducts } from '../hooks/productContext';
import { setProduct } from '../services/repositories';

let name: string | null = null;
let description: string = '';
let sku: string | null = null;

export function AddProductDefinition() {
  const navigation = useNavigation<HomeNavigationProp>();
  const insets = useSafeAreaInsets();
  const [discontinued, setDiscontinued] = useState(false);
  const { addProduct } = useProducts();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Text style={styles.backText}>Volver</Text>
          </Pressable>

          <Text style={styles.headerTitle}>Nuevo producto</Text>

          <View style={{ width: 60 }} />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre del producto"
            placeholderTextColor="#777"
            onChangeText={(value) => {
              name = value;
            }}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Código de producto (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="SKU o código interno"
            placeholderTextColor="#777"
            onChangeText={(value) => {
              sku = value;
            }}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Descripción del producto"
            placeholderTextColor="#777"
            onChangeText={(value) => {
              description = value;
            }}
            multiline
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.label}>Descontinuado</Text>
          <Switch value={discontinued} onValueChange={setDiscontinued} />
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={styles.saveButton}
          onPress={async () => {
            if (!name) {
              console.log('Invalid data');
              return;
            }
            let newProduct: Product | null;
            try {
              newProduct = await setProduct(
                name,
                description,
                discontinued,
                sku
              );
            } catch (error) {
              console.log('Failed to add new product');
              throw error;
            }
            addProduct(newProduct!);
            console.log('Add new product');
          }}
        >
          <Text style={styles.saveButtonText}>Guardar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 16,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 24,
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
  inventoryRow: {
    marginTop: 12,
  },
  dropdownButton: {
    backgroundColor: '#111',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  dropdownText: {
    color: '#fff',
  },
  dropdown: {
    marginTop: 8,
    backgroundColor: '#111',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#222',
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  dropdownItemText: {
    color: '#fff',
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
