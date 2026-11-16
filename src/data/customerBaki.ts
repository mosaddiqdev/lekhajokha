import { baki } from "../engine/baki";
import { type Customer, db, type Entry } from "./db";

export type CustomerBaki = {
  customer: Customer;
  baki: number;
  // Date of the latest entry, for "last entry" on the customer list.
  lastEntryDate?: string;
};

export async function listCustomerBaki(): Promise<CustomerBaki[]> {
  const [customers, entries] = await Promise.all([
    db.customers.toArray(),
    db.entries.toArray(),
  ]);

  const byCustomer = new Map<string, Entry[]>();
  for (const entry of entries) {
    if (entry.deletedAt !== undefined) continue;
    const list = byCustomer.get(entry.customerId) ?? [];
    list.push(entry);
    byCustomer.set(entry.customerId, list);
  }

  return customers
    .filter((customer) => customer.deletedAt === undefined)
    .map((customer) => summarise(customer, byCustomer.get(customer.id) ?? []));
}

// null when there is no such customer or they were deleted.
export async function getCustomerBaki(
  id: string,
): Promise<(CustomerBaki & { entryCount: number }) | null> {
  const customer = await db.customers.get(id);
  if (!customer || customer.deletedAt !== undefined) return null;

  const entries = (await db.entries.where("customerId").equals(id).toArray()).filter(
    (entry) => entry.deletedAt === undefined,
  );
  return { ...summarise(customer, entries), entryCount: entries.length };
}

function summarise(customer: Customer, entries: Entry[]): CustomerBaki {
  const lastEntryDate = entries
    .map((entry) => entry.date)
    .sort()
    .at(-1);
  return {
    customer,
    baki: baki(entries),
    ...(lastEntryDate ? { lastEntryDate } : {}),
  };
}
