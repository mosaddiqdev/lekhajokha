import { describe, expect, it } from "vitest";
import { baki } from "./baki";

describe("baki", () => {
  it("is zero with no entries", () => expect(baki([])).toBe(0));

  it("udhaar raises it and jama lowers it", () => {
    expect(
      baki([
        { kind: "udhaar", paise: 24000 },
        { kind: "jama", paise: 10000 },
      ]),
    ).toBe(14000);
  });

  it("ignores deleted entries", () => {
    expect(
      baki([
        { kind: "udhaar", paise: 24000 },
        { kind: "udhaar", paise: 50000, deletedAt: 1 },
      ]),
    ).toBe(24000);
  });

  it("goes below zero when the customer paid ahead", () => {
    expect(
      baki([
        { kind: "udhaar", paise: 10000 },
        { kind: "jama", paise: 15000 },
      ]),
    ).toBe(-5000);
  });
});
