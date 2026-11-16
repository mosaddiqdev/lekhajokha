import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import { listCustomerBaki } from "./customerBaki";
import { addCustomer } from "./customers";
import { db } from "./db";
import { addEntry, deleteEntry, entriesOf } from "./entries";

beforeEach(async () => {
  await db.customers.clear();
  await db.entries.clear();
});

describe("addEntry", () => {
  it("adds up the lines and keeps how they were typed", async () => {
    const ramesh = await addCustomer({ name: "Ramesh" });
    const entry = await addEntry({
      customerId: ramesh.id,
      kind: "udhaar",
      lines: [{ text: "2*45", label: "aata" }, { text: "120" }, { text: "30" }],
      date: "2026-11-16",
    });

    expect(entry.paise).toBe(24000);
    expect(entry.lines).toEqual([
      { text: "2*45", label: "aata", paise: 9000 },
      { text: "120", paise: 12000 },
      { text: "30", paise: 3000 },
    ]);
    expect(await db.entries.get(entry.id)).toEqual(entry);
  });

  it("takes a plain amount as one line", async () => {
    const ramesh = await addCustomer({ name: "Ramesh" });
    const entry = await addEntry({
      customerId: ramesh.id,
      kind: "jama",
      lines: [{ text: "250" }],
    });
    expect(entry.paise).toBe(25000);
    expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("refuses what is not a real amount", async () => {
    const ramesh = await addCustomer({ name: "Ramesh" });
    const add = (lines: { text: string }[]) =>
      addEntry({ customerId: ramesh.id, kind: "udhaar", lines });

    await expect(add([])).rejects.toThrow("at least one line");
    await expect(add([{ text: "2*" }])).rejects.toThrow("incomplete");
    await expect(add([{ text: "aata" }])).rejects.toThrow("invalid");
    await expect(add([{ text: "0" }])).rejects.toThrow("can't be zero");
    await expect(add([{ text: "6000000" }, { text: "6000000" }])).rejects.toThrow(
      "more than one entry",
    );
    expect(await db.entries.count()).toBe(0);
  });
});

describe("entriesOf", () => {
  it("lists newest day first and leaves out deleted entries", async () => {
    const ramesh = await addCustomer({ name: "Ramesh" });
    const add = (text: string, date: string) =>
      addEntry({ customerId: ramesh.id, kind: "udhaar", lines: [{ text }], date });

    await add("100", "2026-11-14");
    const mistake = await add("999", "2026-11-15");
    await add("200", "2026-11-16");
    await deleteEntry(mistake.id);

    const list = await entriesOf(ramesh.id);
    expect(list.map((entry) => entry.paise)).toEqual([20000, 10000]);
  });

  it("keeps a deleted entry in the table, marked", async () => {
    const ramesh = await addCustomer({ name: "Ramesh" });
    const entry = await addEntry({
      customerId: ramesh.id,
      kind: "udhaar",
      lines: [{ text: "100" }],
    });
    await deleteEntry(entry.id);
    expect((await db.entries.get(entry.id))?.deletedAt).toBeTypeOf("number");
  });
});

describe("listCustomerBaki", () => {
  it("works out each customer's baki from their own entries", async () => {
    const ramesh = await addCustomer({ name: "Ramesh" });
    const sita = await addCustomer({ name: "Sita" });
    await addCustomer({ name: "Gopal" });

    const add = (
      customerId: string,
      kind: "udhaar" | "jama",
      text: string,
      date: string,
    ) => addEntry({ customerId, kind, lines: [{ text }], date });

    await add(ramesh.id, "udhaar", "2*45 + 120 + 30", "2026-11-14");
    await add(ramesh.id, "jama", "100", "2026-11-16");
    await add(sita.id, "udhaar", "500", "2026-11-15");
    const slip = await add(sita.id, "udhaar", "9999", "2026-11-16");
    await deleteEntry(slip.id);

    const rows = await listCustomerBaki();
    const byName = Object.fromEntries(rows.map((row) => [row.customer.name, row]));

    expect(byName.Ramesh?.baki).toBe(14000);
    expect(byName.Ramesh?.lastEntryDate).toBe("2026-11-16");
    expect(byName.Sita?.baki).toBe(50000);
    expect(byName.Sita?.lastEntryDate).toBe("2026-11-15");
    expect(byName.Gopal?.baki).toBe(0);
    expect(byName.Gopal).not.toHaveProperty("lastEntryDate");
    expect(rows).toHaveLength(3);
  });
});
