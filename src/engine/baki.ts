// Baki is what the customer owes the shop. It is always worked out from the
// entries, never stored, so it can't drift from the ledger.

export type EntryKind = "udhaar" | "jama";

type Counted = { kind: EntryKind; paise: number; deletedAt?: number };

// Udhaar diya raises it, payment mila (jama) lowers it. Below zero means the
// customer paid ahead and the shop owes them.
export function baki(entries: Counted[]): number {
  let owed = 0;
  for (const entry of entries) {
    if (entry.deletedAt !== undefined) continue;
    owed += entry.kind === "udhaar" ? entry.paise : -entry.paise;
  }
  return owed;
}
