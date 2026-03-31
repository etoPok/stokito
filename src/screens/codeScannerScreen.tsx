import { useCallback } from 'react';
import { useTypedNavigation } from '../types';
import { resolvePicker } from '../services/pickerService';
import { CameraScanner } from '../components/cameraScanner.android';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function CcodeScannerScreen() {
  const navigation = useTypedNavigation<'CodeScannerScreen'>();
  const insets = useSafeAreaInsets();

  const onScannedCode = useCallback(
    async (value: string) => {
      resolvePicker('codeScanner', value);
      navigation.goBack();
    },
    [navigation]
  );

  return (
    <View
      style={{ flex: 1, marginBottom: insets.bottom, marginTop: insets.top }}
    >
      <CameraScanner
        onCodeScanned={onScannedCode}
        style={StyleSheet.absoluteFill}
        scanSize={250}
      />
      <View style={[styles.header]}>
        <Pressable style={styles.backButton} onPress={navigation.goBack}>
          <Text style={styles.backText}>Volver</Text>
        </Pressable>

        <Text style={styles.headerTitle}>Escanear Código</Text>

        <View style={{ width: 60 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
