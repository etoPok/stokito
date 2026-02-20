import { Text, View, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { HomeNavigationProp } from '../types';
import { useCallback, useState } from 'react';
import { AndroidCamera } from './camera.android';
import { findProduct } from '../services/repositories';
import ScannerMask from './scannerMask';

const SCAN_SIZE = 260;
const RADIUS = 20;

export function Checkout() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<HomeNavigationProp>();
  const [confirmProduct, setConfirmProduct] = useState(false);
  const [scannerLocked, setScannerLocked] = useState(false);

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
        setConfirmProduct(true);
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
            { bottom: insets.bottom, opacity: confirmProduct ? 1 : 0 },
          ]}
          onPress={() => {
            setConfirmProduct(false);
            setScannerLocked(false);
          }}
          disabled={!confirmProduct}
        >
          <Text style={styles.buttonText}>Agregar a la cuenta</Text>
        </Pressable>
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
