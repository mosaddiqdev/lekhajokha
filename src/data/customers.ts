import { type Customer, db } from "./db";

// Names can repeat: a shop often has two Rameshes. The screen asks before
// adding a second one, so nothing here blocks it.
export async function addCustomer(input: {
  name: string;
  phone?: string;
}): Promise<Customer> {
  const name = input.name.trim();
  if (name === "") throw new Error("A customer needs a name");

  const phone = input.phone?.replace(/[\s-]/g, "");
  if (phone !== undefined && phone !== "" && !/^\d{10}$/.test(phone)) {
    throw new Error("A mobile number is 10 digits");
  }

  const customer: Customer = {
    id: crypto.randomUUID(),
    name,
    createdAt: Date.now(),
    ...(phone ? { phone } : {}),
  };
  await db.customers.add(customer);
  return customer;
}
