import {
  Camera,
  Code,
  useCodeScanner,
  useCameraPermission,
  useCameraDevice,
} from 'react-native-vision-camera';
import { Button, Text, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import React, { ReactNode, useCallback, useEffect, useRef } from 'react';

function PermissionPage({ onRequest }: { onRequest: () => void }) {
  return <Button title="Permitir cámara" onPress={onRequest} />;
}

type AndroidCameraProps = {
  onScan: (code: string) => void;
  locked: boolean;
  children?: ReactNode;
};

export const AndroidCamera = React.memo(function AndroidCamera({
  onScan,
  locked,
  children,
}: AndroidCameraProps) {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  const isFocused = useIsFocused();
  const onScanRef = useRef(onScan);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan, locked]);

  const onCodeScanned = useCallback((codes: Code[]) => {
    if (codes.length === 0) return;
    const value = codes[0].value;
    if (value == null) return;
    onScanRef.current(value);
  }, []);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: onCodeScanned,
  });

  if (!hasPermission) return <PermissionPage onRequest={requestPermission} />;
  if (device == null) return <Text> NO CAMERA DEVICE ERROR </Text>;

  return (
    <>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused}
        codeScanner={codeScanner}
      />
      {children}
    </>
  );
});
