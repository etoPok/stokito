export function toUnits(value: string | number): number {
  if (value === null || value === undefined) return 0;

  let numberValue: number;

  if (typeof value === 'string') {
    const normalized = value.replace(/\./g, '').replace(',', '.');
    numberValue = Number(normalized);
  } else {
    numberValue = value;
  }

  if (isNaN(numberValue)) return 0;

  return Math.round(numberValue * 100);
}

export function ensureCurrencyFormat(value: string | number): string {
  let normalized: string;

  if (typeof value === 'number') {
    const raw = Math.trunc(value).toString();
    if (raw.length <= 2) {
      normalized = '0,' + raw.padStart(2, '0');
    } else {
      normalized = raw.slice(0, -2) + ',' + raw.slice(-2);
    }
  } else {
    normalized = value;
  }

  if (normalized == null || (normalized = normalized.trim()).length === 0)
    return '';

  const [rawEntera, decimal] = normalized.split(',');

  // "," -> "0,"
  if (
    decimal !== undefined &&
    rawEntera.trim() === '' &&
    decimal.trim() === ''
  ) {
    return '0,';
  }

  const digits = (rawEntera ?? normalized).replace(/[^0-9]/g, '');

  // insert thousand separators (dots) every 3 digits from the right
  const entera = digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  if (decimal !== undefined) {
    return `${entera},${decimal.slice(0, 2)}`;
  }

  return entera;
}
