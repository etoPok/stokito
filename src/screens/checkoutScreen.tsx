import { Text, View, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTypedNavigation } from '../types';
import { useCallback, useState } from 'react';
import { CameraScanner } from './../components/cameraScanner.android';
import repository from '../services/repositories';
import { Product } from '../domain/product';
import { useSale } from '../hooks/useSale';

export function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useTypedNavigation<'CheckoutScreen'>();
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const { addProduct, getSnapshot, hasActiveSale } = useSale();

  const onCodeScanned = useCallback(async (code: string) => {
    try {
      const product = await repository.fetchProductByCode(code);
      console.log(`Scanned product ${product.name}, Code: ${code}`);
      setScannedProduct(product);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleAddToSale = useCallback(() => {
    if (scannedProduct == null) return;
    addProduct(scannedProduct);
    setScannedProduct(null);
  }, [scannedProduct, addProduct]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'black',
        paddingBottom: insets.bottom,
        paddingTop: insets.top,
      }}
    >
      <CameraScanner
        onCodeScanned={onCodeScanned}
        locked={scannedProduct != null}
        onBack={navigation.goBack}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: insets.bottom + 16,
          paddingHorizontal: 16,
          gap: 12,
        }}
      >
        <Pressable
          style={[styles.button, { opacity: scannedProduct != null ? 1 : 0 }]}
          onPress={() => {
            handleAddToSale();
          }}
          disabled={scannedProduct == null}
        >
          <Text style={styles.buttonText}>Agregar a la cuenta</Text>
        </Pressable>
        {hasActiveSale() && (
          <Pressable
            style={styles.button}
            onPress={() => {
              const snapshot = getSnapshot();
              navigation.navigate('ConfirmSaleScreen', {
                saleId: snapshot.saleId!,
                saleDetails: snapshot.saleDetails,
              });
            }}
          >
            <Text style={styles.buttonText}>Ver venta</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  text: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 16,
    borderRadius: 8,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
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
});
