import { describe, expect, it } from "vitest";
import { arrangeCustomers, sameName, shopTotals } from "./customerList";

const row = (id: string, name: string, baki: number, extra: object = {}) => ({
  customer: { id, name, ...extra },
  baki,
  ...extra,
});

const rows = [
  row("1", "Sita Devi", 50000, { lastEntryDate: "2026-11-15" }),
  row("2", "Ramesh Das", 142000, { lastEntryDate: "2026-11-16" }),
  row("3", "Hemen Saikia", 0, { lastEntryDate: "2026-10-28" }),
  row("4", "Anita Borah", -5000, { lastEntryDate: "2026-11-02" }),
  row("5", "Gopal Kakati", 8550),
];

const names = (list: typeof rows) => list.map((r) => r.customer.name);

describe("arrangeCustomers sorting", () => {
  it("puts the biggest baki first, advance last", () => {
    expect(names(arrangeCustomers(rows, "", "baki"))).toEqual([
      "Ramesh Das",
      "Sita Devi",
      "Gopal Kakati",
      "Hemen Saikia",
      "Anita Borah",
    ]);
  });

  it("puts the latest entry first and customers with none last", () => {
    expect(names(arrangeCustomers(rows, "", "recent"))).toEqual([
      "Ramesh Das",
      "Sita Devi",
      "Anita Borah",
      "Hemen Saikia",
      "Gopal Kakati",
    ]);
  });

  it("sorts by name", () => {
    expect(names(arrangeCustomers(rows, "", "name"))[0]).toBe("Anita Borah");
  });

  it("does not change the list it was given", () => {
    const before = names(rows);
    arrangeCustomers(rows, "", "name");
    expect(names(rows)).toEqual(before);
  });
});

describe("arrangeCustomers search", () => {
  it("finds part of a name in any case", () => {
    expect(names(arrangeCustomers(rows, "  ram ", "baki"))).toEqual(["Ramesh Das"]);
  });

  it("finds a number from a few digits", () => {
    const withPhone = [row("9", "Mohan", 100, { phone: "9876543210" }), ...rows];
    expect(names(arrangeCustomers(withPhone, "98765", "baki"))).toEqual(["Mohan"]);
    expect(names(arrangeCustomers(withPhone, "9", "baki"))).toEqual([]);
  });

  it("returns nothing when nobody matches", () => {
    expect(arrangeCustomers(rows, "zzz", "baki")).toEqual([]);
  });
});

describe("shopTotals", () => {
  it("adds what is owed and ignores advance paid", () => {
    expect(shopTotals(rows)).toEqual({ owed: 200550, owingCount: 3 });
  });

  it("is zero for an empty shop", () => {
    expect(shopTotals([])).toEqual({ owed: 0, owingCount: 0 });
  });
});

describe("sameName", () => {
  it("finds the same name in any case", () => {
    expect(sameName(rows, " ramesh DAS ")?.customer.id).toBe("2");
  });

  it("skips the customer being edited", () => {
    expect(sameName(rows, "Ramesh Das", "2")).toBeUndefined();
  });

  it("says nothing for an empty name", () => {
    expect(sameName(rows, "  ")).toBeUndefined();
  });
});
