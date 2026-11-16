import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import { addCustomer, deleteCustomer, updateCustomer } from "./customers";
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
    await expect(addCustomer({ name: "   " })).rejects.toThrow("Enter a name");
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

describe("updateCustomer", () => {
  it("changes the name and number", async () => {
    const ramesh = await addCustomer({ name: "Ramesh", phone: "9876543210" });
    await updateCustomer(ramesh.id, { name: " Ramesh Das ", phone: "91234 56789" });
    expect(await db.customers.get(ramesh.id)).toMatchObject({
      name: "Ramesh Das",
      phone: "9123456789",
    });
  });

  it("removes the number when it is cleared", async () => {
    const ramesh = await addCustomer({ name: "Ramesh", phone: "9876543210" });
    await updateCustomer(ramesh.id, { name: "Ramesh", phone: "" });
    expect(await db.customers.get(ramesh.id)).not.toHaveProperty("phone");
  });

  it("refuses an empty name and leaves the customer alone", async () => {
    const ramesh = await addCustomer({ name: "Ramesh" });
    await expect(updateCustomer(ramesh.id, { name: " " })).rejects.toThrow(
      "Enter a name",
    );
    expect((await db.customers.get(ramesh.id))?.name).toBe("Ramesh");
  });
});

describe("deleteCustomer", () => {
  it("only marks the customer deleted", async () => {
    const ramesh = await addCustomer({ name: "Ramesh" });
    await deleteCustomer(ramesh.id);
    expect((await db.customers.get(ramesh.id))?.deletedAt).toBeTypeOf("number");
  });
});
