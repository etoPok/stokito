import {
  Camera,
  Code,
  useCodeScanner,
  useCameraPermission,
  useCameraDevice,
} from 'react-native-vision-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { Button, View, StyleSheet, Alert, Pressable, Text } from 'react-native';
import { useCallback, useRef } from 'react';
import { useTypedNavigation } from '../types';
import { resolvePicker } from '../services/pickerService';
import ScannerMask from '../components/scannerMask';

const SCAN_SIZE = 260;
const RADIUS = 20;

export function CcodeScannerScreen() {
  const insets = useSafeAreaInsets();
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const navigation = useTypedNavigation<'CodeScannerScreen'>();
  const isFocused = useIsFocused();
  const locked = useRef<boolean>(false);

  const onCodeScanned = useCallback(
    (codes: Code[]) => {
      if (locked.current || codes.length === 0) return;
      const value = codes[0].value;
      if (value == null) return;
      locked.current = true;
      resolvePicker('codeScanner', value);
      navigation.goBack();
    },
    [locked.current]
  );

  const codeScanner = useCodeScanner({
    codeTypes: ['ean-13', 'ean-8', 'upc-a', 'code-128'],
    onCodeScanned: onCodeScanned,
  });

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Button
          title="Permitir cámara"
          onPress={() => requestPermission()}
        ></Button>
      </View>
    );
  }

  if (device == null) {
    Alert.alert('Error cámara no disponible', undefined, [
      {
        text: 'Volver',
        onPress: () => navigation.goBack(),
      },
    ]);
    return <View style={styles.container}></View>;
  }

  return (
    <>
      <Camera
        device={device}
        isActive={isFocused}
        style={StyleSheet.absoluteFill}
        codeScanner={codeScanner}
      />
      <ScannerMask scanSize={SCAN_SIZE} radius={RADIUS} />
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable
          style={styles.backButton}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={styles.backText}>Volver</Text>
        </Pressable>

        <Text style={styles.headerTitle}>Productos</Text>

        <View style={{ width: 60 }} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
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
