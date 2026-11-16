import { describe, expect, it } from "vitest";
import { parseAmount } from "./amount";

const paise = (text: string, rounding: "rupee" | "paise" = "rupee") => {
  const result = parseAmount(text, rounding);
  return result.ok ? result.paise : result.reason;
};

describe("the examples from the plan", () => {
  it("a plain amount", () => expect(paise("250")).toBe(25000));
  it("2 kg at 45", () => expect(paise("2*45")).toBe(9000));
  it("2.5 kg at 52", () => expect(paise("2.5*52")).toBe(13000));
  it("several things together", () => expect(paise("2*45 + 120 + 30")).toBe(24000));
  it("250 grams at 52 a kilo", () => expect(paise("0.25*52")).toBe(1300));
});

describe("how it is typed", () => {
  it("x and × multiply like *", () => {
    expect(paise("2x45")).toBe(9000);
    expect(paise("2X45")).toBe(9000);
    expect(paise("2×45")).toBe(9000);
  });
  it("spaces do not matter", () => {
    expect(paise("  2 * 45  +  120 ")).toBe(21000);
  });
  it("chains multiply through", () => expect(paise("2*45*2")).toBe(18000));
  it("multiply binds tighter than plus", () => {
    expect(paise("10+2*45")).toBe(10000);
  });
  it("a leading point is fine", () => expect(paise(".5*100")).toBe(5000));
});

describe("rounding", () => {
  it("rounds a line to the nearest rupee by default, half up", () => {
    expect(paise("0.25*522")).toBe(13100); // 130.5 is 131
    expect(paise("0.49")).toBe(0);
    expect(paise("0.5")).toBe(100);
  });
  it("keeps paise when asked", () => {
    expect(paise("0.25*522", "paise")).toBe(13050);
  });
  it("is exact where floats are not", () => {
    expect(paise("19.99*3", "paise")).toBe(5997);
    expect(paise("1.1*3", "paise")).toBe(330);
  });
});

describe("while still typing", () => {
  it("nothing yet", () => {
    expect(paise("")).toBe("empty");
    expect(paise("   ")).toBe("empty");
  });
  it("a dangling operator or point is incomplete, not wrong", () => {
    expect(paise("2*")).toBe("incomplete");
    expect(paise("2*45+")).toBe("incomplete");
    expect(paise("5.")).toBe("incomplete");
    expect(paise(".")).toBe("incomplete");
  });
});

describe("what cannot become a sum", () => {
  it("rejects minus, letters and brackets", () => {
    expect(paise("500-20")).toBe("invalid");
    expect(paise("2*(3+4)")).toBe("invalid");
    expect(paise("aata")).toBe("invalid");
  });
  it("rejects doubled or leading operators", () => {
    expect(paise("2++3")).toBe("invalid");
    expect(paise("2**3")).toBe("invalid");
    expect(paise("*3")).toBe("invalid");
    expect(paise("+3")).toBe("invalid");
  });
  it("rejects two numbers in a row and stray points", () => {
    expect(paise("1.2.3")).toBe("invalid");
    expect(paise("1,200")).toBe("invalid");
    expect(paise("1.2345")).toBe("invalid");
  });
  it("an invalid part wins over an unfinished one", () => {
    expect(paise("2++")).toBe("invalid");
  });
});

describe("the size limit", () => {
  it("allows exactly one crore", () => expect(paise("10000000")).toBe(1_000_000_000));
  it("rejects anything above", () => {
    expect(paise("10000001")).toBe("too-big");
    expect(paise("99999999*99999999")).toBe("too-big");
    expect(paise("1".repeat(81))).toBe("too-big");
  });
});
