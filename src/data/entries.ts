import { MAX_PAISE, parseAmount } from "../engine/amount";
import type { EntryKind } from "../engine/baki";
import { db, type Entry, type EntryLine } from "./db";

// The owner types lines like "2*45". The total is worked out here from those
// lines, so an entry can never disagree with its own breakdown.
export async function addEntry(input: {
  customerId: string;
  kind: EntryKind;
  lines: { text: string; label?: string }[];
  date?: string;
}): Promise<Entry> {
  if (input.lines.length === 0) throw new Error("An entry needs at least one line");

  const lines: EntryLine[] = input.lines.map((line) => {
    const amount = parseAmount(line.text);
    if (!amount.ok) throw new Error(`"${line.text}" is not an amount (${amount.reason})`);
    const label = line.label?.trim();
    return {
      text: line.text.trim(),
      paise: amount.paise,
      ...(label ? { label } : {}),
    };
  });

  const paise = lines.reduce((total, line) => total + line.paise, 0);
  if (paise === 0) throw new Error("An entry can't be zero");
  if (BigInt(paise) > MAX_PAISE) throw new Error("That is more than one entry can hold");

  const entry: Entry = {
    id: crypto.randomUUID(),
    customerId: input.customerId,
    kind: input.kind,
    paise,
    lines,
    date: input.date ?? today(),
    createdAt: Date.now(),
  };
  await db.entries.add(entry);
  return entry;
}

export async function deleteEntry(id: string): Promise<void> {
  await db.entries.update(id, { deletedAt: Date.now() });
}

// Newest first, the way a ledger page reads. Deleted entries are left out.
export async function entriesOf(customerId: string): Promise<Entry[]> {
  const entries = await db.entries.where("customerId").equals(customerId).toArray();
  return entries
    .filter((entry) => entry.deletedAt === undefined)
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
}

// Local date, not UTC: an entry made at 1am in India is still that day's.
function today(): string {
  return new Date().toLocaleDateString("en-CA");
}
