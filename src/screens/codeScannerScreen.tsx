import { useCallback } from 'react';
import { useTypedNavigation } from '../types';
import { resolvePicker } from '../services/pickerService';
import { CameraScanner } from '../components/cameraScanner.android';

export function CcodeScannerScreen() {
  const navigation = useTypedNavigation<'CodeScannerScreen'>();

  const onScannedCode = useCallback(
    async (value: string) => {
      resolvePicker('codeScanner', value);
      navigation.goBack();
    },
    [navigation]
  );

  return (
    <CameraScanner onCodeScanned={onScannedCode} onBack={navigation.goBack} />
  );
}
