import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import { addCustomer } from "./customers";
import { db } from "./db";

beforeEach(async () => {
  await db.customers.clear();
});

describe("addCustomer", () => {
  it("saves a name and an optional mobile number", async () => {
    const ramesh = await addCustomer({ name: "Ramesh", phone: "98765 43210" });
    expect(ramesh.phone).toBe("9876543210");
    expect(await db.customers.get(ramesh.id)).toEqual(ramesh);
  });

  it("works with the name alone and trims it", async () => {
    const sita = await addCustomer({ name: "  Sita Devi " });
    expect(sita.name).toBe("Sita Devi");
    expect(sita).not.toHaveProperty("phone");
  });

  it("treats a blank mobile number as none", async () => {
    const sita = await addCustomer({ name: "Sita", phone: "  " });
    expect(sita).not.toHaveProperty("phone");
  });

  it("rejects an empty name and a short mobile number", async () => {
    await expect(addCustomer({ name: "   " })).rejects.toThrow("needs a name");
    await expect(addCustomer({ name: "Ramesh", phone: "12345" })).rejects.toThrow(
      "10 digits",
    );
  });

  it("allows two customers with the same name", async () => {
    await addCustomer({ name: "Ramesh" });
    await addCustomer({ name: "Ramesh" });
    expect(await db.customers.count()).toBe(2);
  });
});
