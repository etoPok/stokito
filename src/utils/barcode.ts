import { BarcodeFormat } from 'react-native-barcode-creator';
import { v4 as uuid } from 'uuid';

type BarcodeType = 'ean-13' | 'upc-a' | 'code-128' | 'unknown';

function calcCheckDigit(digits: number[], weights: [number, number]): number {
  const sum = digits.reduce((acc, d, i) => acc + d * weights[i % 2], 0);
  return (10 - (sum % 10)) % 10;
}

function isValidEAN13(str: string): boolean {
  const digits = str.split('').map(Number);
  return calcCheckDigit(digits.slice(0, 12), [1, 3]) === digits[12];
}

// function isValidEAN8(str: string): boolean {
//   const digits = str.split('').map(Number);
//   return calcCheckDigit(digits.slice(0, 7), [1, 3]) === digits[7];
// }

function isValidUPCA(str: string): boolean {
  const digits = str.split('').map(Number);
  return calcCheckDigit(digits.slice(0, 11), [3, 1]) === digits[11];
}

export function detectBarcodeType(code: string): BarcodeType {
  if (!code || typeof code !== 'string') return 'unknown';

  const str = code.trim();
  const isAllDigits = /^\d+$/.test(str);

  if (isAllDigits) {
    // if (str.length === 8 && isValidEAN8(str)) return 'ean-8';
    if (str.length === 12 && isValidUPCA(str)) return 'upc-a';
    if (str.length === 13 && isValidEAN13(str)) return 'ean-13';
  }

  if (/^[\x20-\x7E]+$/.test(str)) return 'code-128';

  return 'unknown';
}

const barcodeFormatMap: Record<BarcodeType, any> = {
  'ean-13': BarcodeFormat.EAN13,
  'upc-a': BarcodeFormat.UPCA,
  'code-128': BarcodeFormat.CODE128,
  unknown: null,
};

export function toBarcodeFormat(type: BarcodeType): any {
  return barcodeFormatMap[type];
}

export function getBarcode(): string {
  return uuid().replace(/-/g, '').substring(0, 8).toUpperCase();
}
