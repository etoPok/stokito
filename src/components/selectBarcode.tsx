import { useState } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { RootStackParamList, ScreenNavigation } from '../types';
import { requestBarcodeScanner } from '../services/barcodeScanner';
import {
  detectBarcodeType,
  toBarcodeFormat,
  getBarcode,
} from '../utils/barcode';
import { Barcode } from './barcode';

type SelectedBarcodeProps<S extends keyof RootStackParamList> = {
  navigation: ScreenNavigation<S>;
  onChange: (barcode: string) => void;
};

export function SelectBarcode<S extends keyof RootStackParamList>({
  navigation,
  onChange,
}: SelectedBarcodeProps<S>) {
  const [barcode, setBarcode] = useState<string | null>(null);
  const [barcodeType, setBarcodeType] = useState<any>();

  return (
    <View style={styles.container}>
      {barcode == null ? (
        <View style={styles.actionsContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={async () => {
              navigation.navigate('BarcodeScannerScreen');
              const _barcode = await requestBarcodeScanner();
              if (_barcode) {
                setBarcodeType(toBarcodeFormat(detectBarcodeType(_barcode)));
                setBarcode(_barcode);
                onChange(_barcode);
              }
            }}
          >
            <Text style={styles.buttonText}>Escanear código de barras</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => {
              const _barcode = getBarcode();
              setBarcodeType(toBarcodeFormat(detectBarcodeType(_barcode)));
              setBarcode(_barcode);
              onChange(_barcode);
            }}
          >
            <Text style={styles.buttonText}>Generar código de barras</Text>
          </Pressable>
        </View>
      ) : (
        <Barcode barcode={barcode} format={barcodeType}>
          <Pressable
            style={styles.resetButton}
            onPress={() => setBarcode(null)}
          >
            <Text style={styles.resetText}>Generar o escanear</Text>
          </Pressable>
        </Barcode>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  actionsContainer: {
    width: '100%',
    gap: 16,
  },

  button: {
    backgroundColor: '#0f172a',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e293b',
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  buttonText: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
  },

  resetButton: {
    marginTop: 8,
  },

  resetText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
  },
});
