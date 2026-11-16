// How Home arranges customers: which show, in what order, and the shop totals.

export type Sort = "baki" | "recent" | "name";

type Row = {
  customer: { name: string; phone?: string };
  baki: number;
  lastEntryDate?: string;
};

export function arrangeCustomers<T extends Row>(
  rows: T[],
  query: string,
  sort: Sort,
): T[] {
  const typed = query.trim().toLowerCase();
  const digits = typed.replace(/\D/g, "");

  // A few digits are enough to find a number, but one digit would match everyone.
  const matches = (row: Row) =>
    typed === "" ||
    row.customer.name.toLowerCase().includes(typed) ||
    (digits.length >= 3 && (row.customer.phone?.includes(digits) ?? false));

  return rows.filter(matches).sort((a, b) => order(a, b, sort) || byName(a, b));
}

function order(a: Row, b: Row, sort: Sort): number {
  if (sort === "baki") return b.baki - a.baki;
  if (sort === "recent")
    return (b.lastEntryDate ?? "").localeCompare(a.lastEntryDate ?? "");
  return 0;
}

function byName(a: Row, b: Row): number {
  return a.customer.name.localeCompare(b.customer.name, undefined, {
    sensitivity: "base",
  });
}

// What the shop is owed. A customer who paid ahead doesn't lower it: that money
// is theirs, not a smaller debt from someone else.
export function shopTotals(rows: Row[]): { owed: number; owingCount: number } {
  const owing = rows.filter((row) => row.baki > 0);
  return {
    owed: owing.reduce((sum, row) => sum + row.baki, 0),
    owingCount: owing.length,
  };
}

// Two customers can share a name, so this only warns and never blocks.
export function sameName<T extends { customer: { id: string; name: string } }>(
  rows: T[],
  name: string,
  exceptId?: string,
): T | undefined {
  const typed = name.trim().toLowerCase();
  if (typed === "") return undefined;
  return rows.find(
    (row) =>
      row.customer.id !== exceptId && row.customer.name.trim().toLowerCase() === typed,
  );
}
