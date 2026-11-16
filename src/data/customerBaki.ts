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

  return customers.map((customer) => {
    const own = byCustomer.get(customer.id) ?? [];
    const lastEntryDate = own
      .map((entry) => entry.date)
      .sort()
      .at(-1);
    return {
      customer,
      baki: baki(own),
      ...(lastEntryDate ? { lastEntryDate } : {}),
    };
  });
}
