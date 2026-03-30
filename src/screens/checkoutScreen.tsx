import { Text, View, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTypedNavigation } from '../types';
import { useCallback, useRef, useState } from 'react';
import { CameraScanner } from './../components/cameraScanner.android';
import repository from '../services/repositories';
import { SaleDatail, SaleDetailsByProduct } from '../domain/saleDetails';
import { Product } from '../domain/product';
import { v4 as uuidv4 } from 'uuid';

export function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useTypedNavigation<'CheckoutScreen'>();
  const saleDetails = useRef<SaleDetailsByProduct>({});
  const currentSaleDatail = useRef<SaleDatail | undefined>(undefined);
  const initializedSaleId = useRef<string | null>(null);
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);

  function getSaleDetail(): SaleDatail {
    // check if the product already has an existing sale detail
    const productKey = Object.keys(saleDetails.current).find((key) => {
      return saleDetails.current[key].productName === scannedProduct!.name;
    });
    if (productKey != null) {
      return saleDetails.current[productKey];
    }

    if (
      currentSaleDatail.current == null &&
      scannedProduct != null &&
      initializedSaleId.current != null
    ) {
      const newSaleDetail: SaleDatail = {
        id: uuidv4(),
        saleId: initializedSaleId.current,
        productName: scannedProduct.name!,
        salePrice: 0,
        quantity: 0,
        subtotal: 0,
        isVoided: false,
      };
      saleDetails.current[scannedProduct.name!] = newSaleDetail;
      return newSaleDetail;
    }

    // check if the same product is being scanned to modify the current sale detail
    if (currentSaleDatail.current!.productName === scannedProduct!.name)
      return currentSaleDatail.current!;

    // new scanned product
    const newSaleDetail: SaleDatail = {
      id: uuidv4(),
      saleId: initializedSaleId.current!,
      productName: scannedProduct!.name!,
      salePrice: 0,
      quantity: 0,
      subtotal: 0,
      isVoided: false,
    };
    saleDetails.current[scannedProduct!.name!] = newSaleDetail;
    return newSaleDetail;
  }

  function processSaleDetail() {
    if (scannedProduct == null) return;
    if (initializedSaleId.current == null) {
      initializedSaleId.current = uuidv4();
    }
    const sd = getSaleDetail();
    sd.salePrice = scannedProduct.salePrice!;
    sd.quantity += 1;
    sd.subtotal = sd.salePrice * sd.quantity;

    currentSaleDatail.current = sd;
    setScannedProduct(null);
  }

  const onCodeScanned = useCallback(async (code: string) => {
    try {
      const product = await repository.fetchProductByCode(code);
      console.log(`Found product ${product.id}`);
      console.log(`Code scanned, value ${code}`);
      setScannedProduct(product);
    } catch (error) {
      console.log(error);
    }
  }, []);

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
            processSaleDetail();
          }}
          disabled={scannedProduct == null}
        >
          <Text style={styles.buttonText}>Agregar a la cuenta</Text>
        </Pressable>
        {initializedSaleId.current != null && (
          <Pressable
            style={styles.button}
            onPress={() => {
              navigation.navigate('ConfirmSaleScreen', {
                saleId: initializedSaleId.current!,
                saleDetails: saleDetails.current,
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
