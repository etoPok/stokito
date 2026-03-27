import { createPickerRequest } from './pickerService';

export function requestCodeScanner() {
  return createPickerRequest<string>('codeScanner');
}
