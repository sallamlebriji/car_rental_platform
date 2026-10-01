export function generateReservationReference() {
  const stamp = Date.now().toString().slice(-6);
  return `RES-${stamp}`;
}

export function generateContractNumber() {
  const stamp = Date.now().toString().slice(-8);
  return `CTR-${stamp}`;
}
