import { useEffect, useRef, useState } from 'react';
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { RootStackParamList, ScreenNavigation } from '../types';
import { requestBarcodeScanner } from '../services/barcodeScanner';
import {
  detectBarcodeType,
  toBarcodeFormat,
  getBarcode,
} from '../utils/barcode';
import { Barcode } from './barcode';
import { Ionicons } from '@expo/vector-icons';

type Handle = (code: string, codeType: any) => void;

type HandleCodeProps<S extends keyof RootStackParamList> = {
  navigation: ScreenNavigation<S>;
  code?: string;
  handle?: boolean;
  handleChange: (code: string, codeType: string) => void;
  handleAdd?: (code: string, codeType: string) => void;
  handleRemove?: Handle;
};

export function HandleCode<S extends keyof RootStackParamList>({
  navigation,
  code,
  handle = true,
  handleAdd,
  handleChange,
  handleRemove,
}: HandleCodeProps<S>) {
  const [_pick, setPick] = useState<boolean>(false);
  const codeType = useRef<any>(
    code ? toBarcodeFormat(detectBarcodeType(code)) : null
  );
  const currentHandle = useRef<Handle>(handleChange);

  useEffect(() => {
    if (code) codeType.current = toBarcodeFormat(detectBarcodeType(code));
  }, [code]);

  const options = () => {
    return (
      <View style={styles.container}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={async () => {
            navigation.navigate('BarcodeScannerScreen');
            const _barcode = await requestBarcodeScanner();
            if (_barcode) {
              currentHandle.current(_barcode, detectBarcodeType(_barcode));
              setPick(false);
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
            currentHandle.current(_barcode, detectBarcodeType(_barcode));
            setPick(false);
          }}
        >
          <Text style={styles.buttonText}>Generar código de barras</Text>
        </Pressable>

        {code != null && (
          <Pressable
            style={({ pressed }) => [
              styles.cancelButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => {
              setPick(false);
            }}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </Pressable>
        )}
      </View>
    );
  };

  const showOptions = (handle: Handle) => {
    setPick(true);
    currentHandle.current = handle;
  };

  if (_pick) return options();

  return (
    <>
      <Barcode barcode={code!} format={codeType.current} />
      {handle && (
        <View style={styles.handlerContainer}>
          {handleAdd && (
            <>
              <TouchableOpacity onPress={() => showOptions(handleAdd)}>
                <Ionicons name="add" size={22} color="#999" />
              </TouchableOpacity>
            </>
          )}
          {code && (
            <>
              {handleRemove && (
                <>
                  <View style={styles.spacer}></View>
                  <TouchableOpacity
                    onPress={() => handleRemove(code!, codeType.current)}
                  >
                    <Ionicons name="trash" size={22} color="#999" />
                  </TouchableOpacity>
                  <View style={styles.spacer}></View>
                </>
              )}
              <TouchableOpacity
                onPress={() => handleChange && showOptions(handleChange)}
              >
                <Ionicons name="reload" size={22} color="#999" />
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 12,
  },

  handlerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    padding: 10,
  },

  button: {
    backgroundColor: '#0f172a',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e293b',
    width: 250,
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

  resetText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
  },

  cancelButton: {
    backgroundColor: 'red',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e293b',
    width: 150,
  },

  spacer: {
    width: 1,
    height: 20,
    marginHorizontal: 15,
    backgroundColor: '#999',
  },
});
