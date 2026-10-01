// Display-only mirror of backend/src/utils/priceCalculator.js.
// The backend remains the source of truth for the amounts saved on the reservation.
const round = (value) => Number(Number(value).toFixed(2));

export function packLabel(pack) {
  if (!pack) return "";
  const value = Number(pack.pricingValue || 0);
  if (pack.pricingType === "PERCENTAGE") return `+${value}% du tarif`;
  if (pack.pricingType === "DAILY") return `${value} MAD / jour`;
  return `${value} MAD`;
}

export function optionLabel(option) {
  const value = Number(option?.price || 0);
  return option?.pricingType === "DAILY" ? `${value} MAD / jour` : `${value} MAD`;
}

export function estimateReservation({ pricePerDay, startDate, endDate, pack, options = [], settings }) {
  if (!startDate || !endDate) return null;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;

  const totalDays = Math.max(Math.round((end - start) / 86400000), 1);
  const basePrice = round(Number(pricePerDay || 0) * totalDays);

  let packPrice = 0;
  if (pack) {
    const value = Number(pack.pricingValue || 0);
    if (pack.pricingType === "FIXED") packPrice = value;
    if (pack.pricingType === "PERCENTAGE") packPrice = (basePrice * value) / 100;
    if (pack.pricingType === "DAILY") packPrice = value * totalDays;
  }

  const optionsPrice = options.reduce((sum, option) => {
    const price = Number(option.price || 0);
    return sum + (option.pricingType === "DAILY" ? price * totalDays : price);
  }, 0);

  const bookingFees = Number(settings?.bookingFees || 0);
  const totalPrice = round(basePrice + packPrice + optionsPrice + bookingFees);
  const advanceAmount = round((totalPrice * Number(settings?.requiredAdvancePercent || 0)) / 100);

  return {
    totalDays,
    basePrice,
    packPrice: round(packPrice),
    optionsPrice: round(optionsPrice),
    bookingFees: round(bookingFees),
    totalPrice,
    advanceAmount,
    remainingAmount: round(totalPrice - advanceAmount)
  };
}
