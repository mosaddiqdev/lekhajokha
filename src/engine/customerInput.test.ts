import { describe, expect, it } from "vitest";
import { checkCustomer, formatPhone } from "./customerInput";

describe("checkCustomer", () => {
  it("takes a name alone and trims it", () => {
    expect(checkCustomer({ name: "  Ramesh Das " })).toEqual({
      ok: true,
      value: { name: "Ramesh Das" },
    });
  });

  it("asks for a name", () => {
    expect(checkCustomer({ name: "   " })).toEqual({
      ok: false,
      field: "name",
      message: "Enter a name",
    });
  });

  it("treats a blank mobile number as none", () => {
    expect(checkCustomer({ name: "Sita", phone: "  " })).toEqual({
      ok: true,
      value: { name: "Sita" },
    });
  });

  it("cleans spaces and dashes out of a number", () => {
    const check = checkCustomer({ name: "Sita", phone: "98765 43-210" });
    expect(check).toEqual({ ok: true, value: { name: "Sita", phone: "9876543210" } });
  });

  it("accepts a pasted +91 or 0 prefix", () => {
    const plus = checkCustomer({ name: "S", phone: "+91 98765 43210" });
    const zero = checkCustomer({ name: "S", phone: "098765 43210" });
    expect(plus).toMatchObject({ ok: true, value: { phone: "9876543210" } });
    expect(zero).toMatchObject({ ok: true, value: { phone: "9876543210" } });
  });

  it("rejects short, long and lettered numbers", () => {
    for (const phone of ["12345", "123456789012", "98765x43210"]) {
      expect(checkCustomer({ name: "S", phone })).toMatchObject({
        ok: false,
        field: "phone",
      });
    }
  });
});

describe("formatPhone", () => {
  it("splits into two fives", () => {
    expect(formatPhone("9876543210")).toBe("98765 43210");
  });
});
