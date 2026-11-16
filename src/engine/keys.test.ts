import { describe, expect, it } from "vitest";
import { type Key, typeKey } from "./keys";

const press = (...keys: Key[]) => keys.reduce((text, key) => typeKey(text, key), "");

describe("typeKey", () => {
  it("types digits and backs out", () => {
    expect(press("2", "5", "0")).toBe("250");
    expect(press("2", "5", "0", "back")).toBe("25");
    expect(press("back")).toBe("");
  });

  it("builds a sum", () => {
    expect(press("2", "×", "4", "5", "+", "1", "2", "0")).toBe("2×45+120");
  });

  it("will not start with an operator", () => {
    expect(press("×")).toBe("");
    expect(press("+", "5")).toBe("5");
  });

  it("swaps a doubled operator for the last one", () => {
    expect(press("2", "×", "+")).toBe("2+");
    expect(press("2", "+", "×", "×")).toBe("2×");
  });

  it("allows one point per number", () => {
    expect(press("2", ".", "5", ".")).toBe("2.5");
    expect(press("2", ".", "5", "+", "1", ".", "5")).toBe("2.5+1.5");
  });

  it("starts a bare point as 0.", () => {
    expect(press(".")).toBe("0.");
    expect(press("2", "×", ".", "5")).toBe("2×0.5");
  });

  it("will not follow a point with an operator", () => {
    expect(press("2", ".", "×")).toBe("2.");
  });

  it("stops at three decimals", () => {
    expect(press("0", ".", "1", "2", "5", "7")).toBe("0.125");
    expect(press("0", ".", "1", "2", "0", "0")).toBe("0.120");
    expect(press("0", ".", "1", "00")).toBe("0.100");
    expect(press("0", ".", "1", "2", "00")).toBe("0.12");
  });

  it("replaces a leading zero and stops 00 from stacking zeros", () => {
    expect(press("0", "5")).toBe("5");
    expect(press("0", "0", "0")).toBe("0");
    expect(press("00")).toBe("");
    expect(press("5", "00")).toBe("500");
  });
});
