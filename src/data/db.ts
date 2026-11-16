import Dexie, { type EntityTable } from "dexie";
import type { EntryKind } from "../engine/baki";

export type Customer = {
  id: string;
  name: string;
  phone?: string;
  createdAt: number;
  // A deleted customer leaves the list but keeps every entry, so nothing in
  // the ledger is ever lost to one tap.
  deletedAt?: number;
};

// One typed part of an entry: "2*45" and its worked-out paise. The text is kept
// so the owner can open an entry later and see how the total was made.
export type EntryLine = { text: string; label?: string; paise: number };

export type Entry = {
  id: string;
  customerId: string;
  kind: EntryKind;
  // Total of the lines. Always whole paise.
  paise: number;
  lines: EntryLine[];
  // The day it happened (YYYY-MM-DD), which the owner can change. createdAt only
  // keeps entries of one day in the order they were made.
  date: string;
  createdAt: number;
  // Deleted entries stay in the table so nothing disappears without a trace.
  deletedAt?: number;
};

export const db = new Dexie("lekhajokha") as Dexie & {
  customers: EntityTable<Customer, "id">;
  entries: EntityTable<Entry, "id">;
};

db.version(1).stores({
  customers: "id, name",
  entries: "id, customerId, date",
});
