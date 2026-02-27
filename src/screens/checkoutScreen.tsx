import { Text, View, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTypedNavigation } from '../types';
import { useCallback, useRef, useState } from 'react';
import { AndroidCamera } from './../components/camera.android';
import { findProduct } from '../services/repositories';
import ScannerMask from './../components/scannerMask';
import { SaleDatail } from '../domain/saleDetails';
import { Product } from '../domain/product';
import { v4 as uuidv4 } from 'uuid';
import { useSaleDetails } from '../hooks/saleDetailsContext';

const SCAN_SIZE = 260;
const RADIUS = 20;

export function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useTypedNavigation<'CheckoutScreen'>();
  const [scannerLocked, setScannerLocked] = useState(false);
  const { saleDetails, addSaleDetail, setSaleDetails } = useSaleDetails();
  const currentSaleDatail = useRef<SaleDatail | undefined>(undefined);
  const initializedSaleId = useRef<string | null>(null);
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);

  function getSaleDetail(): SaleDatail {
    // check if the product already has an existing sale detail
    const foundSaleDatail = saleDetails.find((sd) => {
      return sd.productName === scannedProduct!.name;
    });

    if (foundSaleDatail != null) {
      return foundSaleDatail;
    }

    if (
      currentSaleDatail.current == null &&
      scannedProduct != null &&
      initializedSaleId.current != null
    ) {
      const newSaleDetail = new SaleDatail(
        uuidv4(),
        initializedSaleId.current,
        scannedProduct.name,
        0,
        0,
        0
      );
      addSaleDetail(newSaleDetail);
      return newSaleDetail;
    }

    // check if the same product is being scanned to modify the current sale detail
    if (currentSaleDatail.current!.productName === scannedProduct!.name)
      return currentSaleDatail.current!;

    // new scanned product
    const newSaleDetail = new SaleDatail(
      uuidv4(),
      initializedSaleId.current!,
      scannedProduct!.name,
      0,
      0,
      0
    );
    addSaleDetail(newSaleDetail);
    return newSaleDetail;
  }

  function processSaleDetail() {
    if (scannedProduct == null) return;
    if (initializedSaleId.current == null) {
      // initiaze sale ID
      initializedSaleId.current = uuidv4();
    }
    const sd = getSaleDetail();
    sd.price = scannedProduct.salePrice;
    sd.quantity += 1;
    sd.subtotal = sd.price * sd.quantity;

    currentSaleDatail.current = sd;
    setScannedProduct(null);
    setScannerLocked(false);
  }

  const handleScan = useCallback(
    async (code: string) => {
      if (scannerLocked) {
        console.log('scannerlocked');
        return;
      }

      setScannerLocked(true);
      try {
        const product = await findProduct(code);
        console.log(`Found product ${product.id}`);
        setScannedProduct(product);
      } catch (error) {
        console.log(error);
      }
      console.log(`QR scanned, value ${code}`);
    },
    [scannerLocked]
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'black',
        paddingBottom: insets.bottom,
        paddingTop: insets.top,
      }}
    >
      <AndroidCamera onScan={handleScan} locked={scannerLocked}>
        <ScannerMask scanSize={SCAN_SIZE} radius={RADIUS} />
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Pressable
              style={styles.backButton}
              onPress={() => {
                navigation.goBack();
                setSaleDetails([]);
              }}
            >
              <Text style={styles.backText}>Volver</Text>
            </Pressable>
            <View style={{ width: 60 }} />
          </View>
        </View>
      </AndroidCamera>
      <View>
        <Pressable
          style={[
            styles.button,
            { bottom: insets.bottom, opacity: scannedProduct != null ? 1 : 0 },
          ]}
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
  scanArea: {
    width: SCAN_SIZE,
    height: SCAN_SIZE,
    borderWidth: 3,
    borderColor: '#00FFAA',
    borderRadius: 20,
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
