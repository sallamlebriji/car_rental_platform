import dayjs from "dayjs";
import { PricingType, OptionPricingType } from "@prisma/client";

function roundCurrency(value) {
  return Number(Number(value).toFixed(2));
}

export function calculateReservationPricing({ carPricePerDay, startDate, endDate, pack, options = [], reservationSettings }) {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const totalDays = Math.max(end.diff(start, "day"), 1);
  const basePrice = roundCurrency(Number(carPricePerDay) * totalDays);

  let packPrice = 0;
  if (pack) {
    const packValue = Number(pack.pricingValue);
    if (pack.pricingType === PricingType.FIXED) packPrice = packValue;
    if (pack.pricingType === PricingType.PERCENTAGE) packPrice = (basePrice * packValue) / 100;
    if (pack.pricingType === PricingType.DAILY) packPrice = packValue * totalDays;
  }

  const optionsPrice = options.reduce((sum, option) => {
    const optionPrice = Number(option.price);
    if (option.pricingType === OptionPricingType.DAILY) return sum + optionPrice * totalDays;
    return sum + optionPrice;
  }, 0);

  const bookingFees = Number(reservationSettings?.bookingFees || 0);
  const totalPrice = roundCurrency(basePrice + packPrice + optionsPrice + bookingFees);
  const advancePercent = Number(reservationSettings?.requiredAdvancePercent || 0);
  const advanceAmount = roundCurrency((totalPrice * advancePercent) / 100);
  const remainingAmount = roundCurrency(totalPrice - advanceAmount);

  return {
    totalDays,
    basePrice: roundCurrency(basePrice),
    packPrice: roundCurrency(packPrice),
    optionsPrice: roundCurrency(optionsPrice),
    bookingFees: roundCurrency(bookingFees),
    totalPrice,
    advanceAmount,
    remainingAmount
  };
}
