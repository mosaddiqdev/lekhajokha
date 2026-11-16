// What the Add customer form sends. This is the edge for typed and pasted text,
// so it is where names and mobile numbers get checked.

export type CustomerInput = { name: string; phone?: string };

export type CustomerCheck =
  | { ok: true; value: { name: string; phone?: string } }
  | { ok: false; field: "name" | "phone"; message: string };

export function checkCustomer(input: CustomerInput): CustomerCheck {
  const name = input.name.trim();
  if (name === "") return { ok: false, field: "name", message: "Enter a name" };

  const typed = input.phone?.trim() ?? "";
  if (typed === "") return { ok: true, value: { name } };

  const phone = tenDigits(typed);
  if (phone === undefined) {
    return { ok: false, field: "phone", message: "A mobile number has 10 digits" };
  }
  return { ok: true, value: { name, phone } };
}

// People paste "+91 98765 43210" or "098765 43210". Both mean the same number.
function tenDigits(typed: string): string | undefined {
  if (!/^[\d\s+()-]+$/.test(typed)) return undefined;
  const digits = typed.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits.length === 10 ? digits : undefined;
}

// 9876543210 reads easier as 98765 43210.
export function formatPhone(phone: string): string {
  return `${phone.slice(0, 5)} ${phone.slice(5)}`;
}
