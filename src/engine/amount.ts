// The smart amount box: "2*45 + 120" becomes whole paise.
// BigInt all the way, because 19.99 * 3 must be 59.97 and floats say 59.96999.

export type Rounding = "rupee" | "paise";

export type AmountResult =
  | { ok: true; paise: number }
  // empty: nothing typed. incomplete: still typing ("2*", "5."), so show nothing yet.
  // invalid: can never become a sum. too-big: past what one entry can hold.
  | { ok: false; reason: "empty" | "incomplete" | "invalid" | "too-big" };

// One crore rupees. No shop gives that much udhaar in one entry, so a number
// this large is a slipped finger.
export const MAX_PAISE = 1_000_000_000n;
const MAX_TEXT_LENGTH = 80;
// Loose goods are weighed to the gram: 0.125 kg is the finest the box needs.
const MAX_DECIMALS = 3;

type Token =
  | { kind: "number"; whole: bigint; decimals: number }
  | { kind: "times" }
  | { kind: "plus" };

// A decimal like 2.5 is kept as 25 with 1 decimal, so the maths stays exact.
type Exact = { whole: bigint; decimals: number };

export function parseAmount(text: string, rounding: Rounding = "rupee"): AmountResult {
  if (text.length > MAX_TEXT_LENGTH) return { ok: false, reason: "too-big" };

  const scanned = scan(text);
  if (scanned === "invalid") return { ok: false, reason: "invalid" };
  if (scanned.tokens.length === 0) return { ok: false, reason: "empty" };

  const terms = groupTerms(scanned.tokens);
  if (terms === "invalid") return { ok: false, reason: "invalid" };
  if (terms === "incomplete" || scanned.danglingPoint) {
    return { ok: false, reason: "incomplete" };
  }

  const paise = toPaise(sum(terms.map(multiply)), rounding);
  if (paise > MAX_PAISE) return { ok: false, reason: "too-big" };
  return { ok: true, paise: Number(paise) };
}

function scan(text: string): { tokens: Token[]; danglingPoint: boolean } | "invalid" {
  const tokens: Token[] = [];
  let danglingPoint = false;
  let i = 0;

  while (i < text.length) {
    const ch = text.charAt(i);

    if (ch === " ") {
      i += 1;
    } else if (ch === "+") {
      tokens.push({ kind: "plus" });
      i += 1;
    } else if (ch === "*" || ch === "x" || ch === "X" || ch === "×") {
      tokens.push({ kind: "times" });
      i += 1;
    } else if ((ch >= "0" && ch <= "9") || ch === ".") {
      let end = i;
      while (end < text.length && /[0-9.]/.test(text.charAt(end))) end += 1;
      const [whole = "", fraction = "", ...extra] = text.slice(i, end).split(".");
      if (extra.length > 0 || fraction.length > MAX_DECIMALS) return "invalid";
      if (text.slice(i, end).includes(".") && fraction === "") danglingPoint = true;
      tokens.push({
        kind: "number",
        whole: BigInt(`${whole}${fraction}` || "0"),
        decimals: fraction.length,
      });
      i = end;
    } else {
      // Minus, brackets, letters: not in V1.
      return "invalid";
    }
  }

  return { tokens, danglingPoint };
}

// "2*45 + 120" is two terms: [2, 45] and [120]. Numbers and operators must alternate.
function groupTerms(tokens: Token[]): Exact[][] | "invalid" | "incomplete" {
  const terms: Exact[][] = [[]];
  let expectNumber = true;

  for (const token of tokens) {
    const current = terms[terms.length - 1];
    if (!current) return "invalid";

    if (token.kind === "number") {
      if (!expectNumber) return "invalid";
      current.push({ whole: token.whole, decimals: token.decimals });
      expectNumber = false;
    } else {
      if (expectNumber) return "invalid";
      if (token.kind === "plus") terms.push([]);
      expectNumber = true;
    }
  }

  return expectNumber ? "incomplete" : terms;
}

function multiply(factors: Exact[]): Exact {
  return factors.reduce(
    (product, factor) => ({
      whole: product.whole * factor.whole,
      decimals: product.decimals + factor.decimals,
    }),
    { whole: 1n, decimals: 0 },
  );
}

function sum(terms: Exact[]): Exact {
  return terms.reduce((total, term) => {
    const decimals = Math.max(total.decimals, term.decimals);
    return {
      whole: lift(total, decimals) + lift(term, decimals),
      decimals,
    };
  });
}

function lift(value: Exact, decimals: number): bigint {
  return value.whole * 10n ** BigInt(decimals - value.decimals);
}

function toPaise(rupees: Exact, rounding: Rounding): bigint {
  const unit = 10n ** BigInt(rupees.decimals);
  if (rounding === "rupee") return roundHalfUp(rupees.whole, unit) * 100n;
  return roundHalfUp(rupees.whole * 100n, unit);
}

// Half up, the way a shopkeeper rounds: 130.5 is 131.
function roundHalfUp(numerator: bigint, denominator: bigint): bigint {
  return (2n * numerator + denominator) / (2n * denominator);
}
