import {
  Camera,
  Code,
  useCodeScanner,
  useCameraPermission,
  useCameraDevice,
} from 'react-native-vision-camera';
import {
  View,
  Button,
  StyleSheet,
  Alert,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef } from 'react';
import ScannerMask from './scannerMask';

type CameraScannerProps = {
  onCodeScanned: (code: string) => Promise<void>;
  style: StyleProp<ViewStyle>;
  scanSize: number;
  radius?: number;
  locked?: boolean;
  mode?: 'persistence' | 'lock';
};

export const CameraScanner = React.memo(function AndroidCamera({
  onCodeScanned,
  style,
  locked,
  scanSize,
  radius = 15,
  mode = 'lock',
}: CameraScannerProps) {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  const isFocused = useIsFocused();
  const cameraRef = useRef<Camera>(null);
  const internalLocked = useRef<boolean>(false);
  const lastScannedCode = useRef<string | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const processCode = useCallback(
    (value: string) => {
      if (locked != null) {
        internalLocked.current = true;
        onCodeScanned(value).then((_) => (internalLocked.current = false));
      } else {
        internalLocked.current = true;
        onCodeScanned(value);
      }
    },
    [onCodeScanned, locked]
  );

  const handleLockMode = useCallback(
    (codes: Code[]) => {
      if (internalLocked.current || codes.length === 0) return;
      const value = codes[0].value;
      if (value == null) return;

      if (locked != null) {
        if (locked) return;
        internalLocked.current = true;
        (onCodeScanned(value) as Promise<any>).then(
          () => (internalLocked.current = false)
        );
      } else {
        internalLocked.current = true;
        onCodeScanned(value);
      }
    },
    [onCodeScanned, locked]
  );

  const handlePersistenceMode = useCallback(
    (codes: Code[]) => {
      if (codes.length === 0) return;
      const value = codes[0].value;
      if (value == null) return;

      // codigo distinto durante el timer, o mismo codigo despues del timer
      if (value !== lastScannedCode.current) {
        lastScannedCode.current = value;
        processCode(value);
      }

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        // permitir escaneo de cualquier codigo
        debounceTimer.current = null;
        lastScannedCode.current = null;
      }, 1500);
    },
    [processCode]
  );

  const codeScanner = useCodeScanner({
    codeTypes: ['ean-13', 'ean-8', 'upc-a', 'code-128'],
    onCodeScanned: mode === 'lock' ? handleLockMode : handlePersistenceMode,
  });

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Button title="Permitir cámara" onPress={requestPermission}></Button>
      </View>
    );
  }

  if (device == null) {
    Alert.alert('Error cámara no disponible', undefined, [
      {
        text: 'Aceptar',
      },
    ]);
    return null;
  }

  return (
    <>
      <Camera
        ref={cameraRef}
        style={style}
        device={device}
        isActive={isFocused}
        codeScanner={codeScanner}
      />
      <ScannerMask scanSize={scanSize} radius={radius} />
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
});
