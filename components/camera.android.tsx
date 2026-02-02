import {
  useCameraPermission,
  Camera,
  useCameraDevice,
} from "react-native-vision-camera";
import { Button, StyleSheet, Text } from "react-native";

function NoCameraDeviceError() {
  return (
    <>
      <Text> ERROR DEVICE </Text>
    </>
  );
}

function PermissionPage({ onRequest }: { onRequest: () => void }) {
  return (
    <>
      <Button title="Permitir cámara" onPress={onRequest} />
    </>
  );
}

export function CustomCamera() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");

  if (!hasPermission) return <PermissionPage onRequest={requestPermission} />;
  if (device == null) return <NoCameraDeviceError />;

  return (
    <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} />
  );
}
