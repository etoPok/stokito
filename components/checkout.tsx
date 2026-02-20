import { Text, View, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { HomeNavigationProp } from '../types';
import { useCallback, useState } from 'react';
import { AndroidCamera } from './camera.android';
import { findProduct } from '../services/repositories';

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

        <View style={styles.overlay}>
          <View style={styles.topSection}>
            <Text style={styles.text}>Escanear código QR</Text>
          </View>

          <View style={styles.centerSection}>
            <View style={styles.scanArea} />
          </View>

          <View style={styles.bottomSection}>
            {confirmProduct && (
              <Pressable
                style={styles.button}
                onPress={() => {
                  setConfirmProduct(false);
                  setScannerLocked(false);
                }}
              >
                <Text style={styles.buttonText}>Confirmar</Text>
              </Pressable>
            )}
          </View>
        </View>
      </AndroidCamera>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 24,
  },
  topSection: {
    alignItems: 'center',
  },

  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomSection: {
    justifyContent: 'flex-end',
    alignItems: 'center',
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
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'white',
    alignSelf: 'center',
    marginTop: '30%',
    borderRadius: 12,
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
