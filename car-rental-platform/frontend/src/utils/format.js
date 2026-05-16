export function currency(value) {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 2
  }).format(Number(value || 0));
}

export function compactCurrency(value) {
  const amount = Number(value || 0);
  if (Math.abs(amount) >= 1000000) {
    return `${(amount / 1000000).toFixed(1)} M MAD`;
  }
  if (Math.abs(amount) >= 1000) {
    return `${(amount / 1000).toFixed(1)} k MAD`;
  }
  return `${amount.toFixed(0)} MAD`;
}

export function date(value) {
  return new Date(value).toLocaleDateString("fr-FR");
}
