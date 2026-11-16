import { describe, expect, it } from "vitest";
import { formatRupees } from "./rupees";

describe("formatRupees", () => {
  it("shows whole rupees with no paise", () => {
    expect(formatRupees(24000)).toBe("240");
    expect(formatRupees(0)).toBe("0");
  });
  it("groups the Indian way", () => {
    expect(formatRupees(100_000)).toBe("1,000");
    expect(formatRupees(12_000_000)).toBe("1,20,000");
    expect(formatRupees(1_000_000_000)).toBe("1,00,00,000");
  });
  it("shows paise only when there are some", () => {
    expect(formatRupees(13050)).toBe("130.50");
    expect(formatRupees(5)).toBe("0.05");
  });
  it("keeps the sign for advance paid", () => {
    expect(formatRupees(-5000)).toBe("-50");
  });
});
