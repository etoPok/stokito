import {
  Camera,
  Code,
  useCodeScanner,
  useCameraPermission,
  useCameraDevice,
} from 'react-native-vision-camera';
import { View, Button, StyleSheet, Alert, Pressable, Text } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import React, { useCallback, useRef } from 'react';
import ScannerMask from './scannerMask';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SCAN_SIZE = 260;
const RADIUS = 20;

type CameraScannerProps = {
  onCodeScanned: (code: string) => Promise<void>;
  onBack: () => void;
  locked?: boolean;
};

export const CameraScanner = React.memo(function AndroidCamera({
  onCodeScanned,
  onBack,
  locked,
}: CameraScannerProps) {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const cameraRef = useRef<Camera>(null);
  const internalLocked = useRef<boolean>(false);

  const handleScannedCodeWithCustomLock = useCallback(
    (codes: Code[]) => {
      if (internalLocked.current || locked || codes.length === 0) return;
      const value = codes[0].value;
      if (value == null) return;
      internalLocked.current = true;
      onCodeScanned(value).then((_) => (internalLocked.current = false));
    },
    [onCodeScanned, locked]
  );

  const handleScannedCode = useCallback(
    (codes: Code[]) => {
      if (internalLocked.current || codes.length === 0) return;
      const value = codes[0].value;
      if (value == null) return;
      internalLocked.current = true;
      onCodeScanned(value);
    },
    [onCodeScanned]
  );

  const codeScanner = useCodeScanner({
    codeTypes: ['ean-13', 'ean-8', 'upc-a', 'code-128'],
    onCodeScanned:
      locked != null ? handleScannedCodeWithCustomLock : handleScannedCode,
  });

  if (!hasPermission) {
    return (
      <>
        <View style={[styles.header]}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <Text style={styles.backText}>Volver</Text>
          </Pressable>

          <Text style={styles.headerTitle}>Escanear Código</Text>

          <View style={{ width: 60 }} />
        </View>
        <View style={styles.container}>
          <Button title="Permitir cámara" onPress={requestPermission}></Button>
        </View>
      </>
    );
  }

  if (device == null) {
    Alert.alert('Error cámara no disponible', undefined, [
      {
        text: 'Aceptar',
      },
    ]);
    return (
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>Volver</Text>
        </Pressable>

        <Text style={styles.headerTitle}>Escanear Código</Text>

        <View style={{ width: 60 }} />
      </View>
    );
  }

  return (
    <>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused}
        codeScanner={codeScanner}
      />
      <ScannerMask scanSize={SCAN_SIZE} radius={RADIUS} />
      <View style={[styles.header]}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>Volver</Text>
        </Pressable>

        <Text style={styles.headerTitle}>Escanear Código</Text>

        <View style={{ width: 60 }} />
      </View>
    </>
  );
});

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
