// What each press on the amount keypad does to the typed text. The keypad never
// lets the owner type something parseAmount would call invalid.

export type Key =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "00"
  | "."
  | "×"
  | "+"
  | "back";

const OPERATORS = ["×", "+"];
const MAX_DECIMALS = 3;

export function typeKey(text: string, key: Key): string {
  if (key === "back") return text.slice(0, -1);

  const last = text.slice(-1);
  const lastIsOperator = OPERATORS.includes(last);

  if (OPERATORS.includes(key)) {
    // Nothing to operate on yet, or the number so far is just a lone point.
    if (text === "" || last === ".") return text;
    // A second operator replaces the first, so a slipped finger fixes itself.
    if (lastIsOperator) return text.slice(0, -1) + key;
    return text + key;
  }

  const number = currentNumber(text);

  if (key === ".") {
    if (number.includes(".")) return text;
    return number === "" ? `${text}0.` : `${text}.`;
  }

  // Digits. No fourth decimal, and no 007: a leading zero is replaced.
  const decimals = number.split(".")[1];
  if (decimals !== undefined && decimals.length + key.length > MAX_DECIMALS) return text;
  if (number === "0" && key !== "00") return text.slice(0, -1) + key;
  if (number === "0" || (number === "" && key === "00")) return text;
  return text + key;
}

// The number being typed right now: everything after the last operator.
function currentNumber(text: string): string {
  const cut = Math.max(text.lastIndexOf("×"), text.lastIndexOf("+"));
  return text.slice(cut + 1);
}
