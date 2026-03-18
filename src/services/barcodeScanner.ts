import { createPickerRequest } from './pickerService';

export function requestBarcodeScanner() {
  return createPickerRequest<string>('barcodeScanner');
}
