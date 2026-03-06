export function getFormatedPrice(value: number): string {
  const formatted = (value / 100).toFixed(2);
  return formatted;
}

export function getPriceToNumber(value: string): number {
  const onlyNumbers = value.replace(/[^0-9]/g, '');
  const parsedSalePrice = parseInt(onlyNumbers || '0', 10);
  return parsedSalePrice;
}
