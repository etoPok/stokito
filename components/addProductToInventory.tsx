import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Switch,
  Pressable,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { HomeNavigationProp } from '../types';
import { Product } from '../domain/product';
import { useProducts } from '../hooks/productContext';
import { addProductToInventory } from '../services/repositories';
import { useInventories } from '../hooks/inventoryContext';
import Inventory from '../domain/inventory';
import QRCode from 'react-native-qrcode-svg';
import { v4 as uuidv4 } from 'uuid';

let name: string | null = null;
let sku: string | null = null;
let description: string | null = null;
let stock: number | null = null;

export function AddProductToInventory() {
  const navigation = useNavigation<HomeNavigationProp>();
  const insets = useSafeAreaInsets();
  const [discontinued, setDiscontinued] = useState(false);
  const { addProduct } = useProducts();

  const { inventories } = useInventories();
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(
    null
  );

  const [idQR, setIdQR] = useState<string | undefined>(undefined);
  useEffect(() => {
    console.log('idQR: ', idQR);
  }, [idQR]);

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
      <ScrollView>
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
            <Text style={styles.label}>Stock</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Cantidad disponible"
              placeholderTextColor="#777"
              onChangeText={(value) => {
                stock = Number(value);
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

          <View style={styles.field}>
            <Text style={styles.label}>Inventario</Text>

            <Pressable
              style={styles.dropdownButton}
              onPress={() => setInventoryOpen(!inventoryOpen)}
            >
              <Text style={styles.dropdownText}>
                {selectedInventory
                  ? selectedInventory.name
                  : 'Seleccionar inventario'}
              </Text>
            </Pressable>

            {inventoryOpen && (
              <View style={styles.dropdown}>
                {inventories.map((inv) => (
                  <Pressable
                    key={inv.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedInventory(inv);
                      setInventoryOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{inv.name}</Text>
                  </Pressable>
                ))}
              </View>
            )}

            <View style={styles.field}>
              {idQR === undefined && (
                <Pressable
                  style={styles.qrButton}
                  onPress={() => {
                    setIdQR(uuidv4());
                  }}
                >
                  <Text style={styles.qrButtonText}>Generar código QR</Text>
                </Pressable>
              )}
              {idQR !== undefined && (
                <View style={styles.qrPreviewContainer}>
                  <View style={styles.qrBox}>
                    <QRCode value={idQR} size={200} />
                    <Text style={styles.qrPlaceholderText}>Vista previa</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable
            style={styles.saveButton}
            onPress={async () => {
              if (
                !name ||
                !description ||
                !stock ||
                !selectedInventory ||
                idQR === undefined
              ) {
                console.log('Invalid data');
                return;
              }
              let newProduct: Product | null;
              try {
                newProduct = await addProductToInventory(
                  idQR,
                  name,
                  description,
                  discontinued,
                  sku,
                  stock,
                  selectedInventory!.id!
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
      </ScrollView>
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
    marginVertical: 20,
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
    marginBottom: 12,
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
    marginBottom: 12,
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
  qrButton: {
    backgroundColor: '#222',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  qrButtonText: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: '500',
  },
  qrPreviewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  qrBox: {
    width: 200,
    height: 200,
    backgroundColor: '#111',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#222',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrPlaceholderText: {
    marginTop: 10,
    color: '#ccc',
    fontSize: 14,
  },
});
