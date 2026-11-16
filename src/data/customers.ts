import { type CustomerInput, checkCustomer } from "../engine/customerInput";
import { type Customer, db } from "./db";

// Names can repeat: a shop often has two Rameshes. The form only warns about
// it, so nothing here blocks a second one.
export async function addCustomer(input: CustomerInput): Promise<Customer> {
  const customer: Customer = {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    ...valid(input),
  };
  await db.customers.add(customer);
  return customer;
}

export async function updateCustomer(id: string, input: CustomerInput): Promise<void> {
  const { name, phone } = valid(input);
  // An undefined phone removes the number the customer had.
  await db.customers.update(id, { name, phone });
}

export async function deleteCustomer(id: string): Promise<void> {
  await db.customers.update(id, { deletedAt: Date.now() });
}

function valid(input: CustomerInput): { name: string; phone?: string } {
  const check = checkCustomer(input);
  if (!check.ok) throw new Error(check.message);
  return check.value;
}
