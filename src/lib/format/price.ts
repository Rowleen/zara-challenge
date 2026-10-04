export function formatPrice(price: number): string {
  const amount = Number.isInteger(price) ? price : price.toFixed(2);
  return `${amount} EUR`;
}
