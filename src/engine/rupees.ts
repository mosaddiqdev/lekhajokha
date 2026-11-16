// Paise to what the owner reads. Indian grouping: 1,20,000 not 120,000.

// Whole rupees show no paise, so ₹240 stays ₹240. Paise only appear when
// there are some, and then always two digits.
export function formatRupees(paise: number): string {
  const sign = paise < 0 ? "-" : "";
  const abs = Math.abs(paise);
  const rupees = Math.floor(abs / 100);
  const rest = abs % 100;

  const whole = new Intl.NumberFormat("en-IN").format(rupees);
  return rest === 0
    ? `${sign}${whole}`
    : `${sign}${whole}.${String(rest).padStart(2, "0")}`;
}
