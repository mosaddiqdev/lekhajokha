import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { listCustomerBaki } from "../data/customerBaki";
import { arrangeCustomers, type Sort, shopTotals } from "../engine/customerList";
import { Segmented } from "../ui/Segmented";
import { CustomerList } from "./CustomerList";
import { Dock } from "./Dock";
import { Empty } from "./Empty";
import styles from "./Home.module.css";
import { HomeHeader } from "./HomeHeader";

const SORTS: { value: Sort; label: string }[] = [
  { value: "baki", label: "Most baki" },
  { value: "recent", label: "Recent" },
  { value: "name", label: "Name" },
];

export function Home({ selectedId }: { selectedId?: string }) {
  const rows = useLiveQuery(listCustomerBaki);
  const [sort, setSort] = useState<Sort>("baki");
  const [query, setQuery] = useState("");

  // Until the first read finishes there is nothing true to show.
  if (!rows) return <div className={styles.home} />;

  const shown = arrangeCustomers(rows, query, sort);
  const totals = shopTotals(rows);

  return (
    <div className={styles.home}>
      <div className={styles.scroll}>
        <HomeHeader {...totals} />
        {rows.length > 0 && (
          <div className={styles.sort}>
            <Segmented
              label="Sort customers"
              options={SORTS}
              value={sort}
              onChange={setSort}
            />
          </div>
        )}
        {shown.length > 0 ? (
          <CustomerList rows={shown} selectedId={selectedId} />
        ) : (
          <Empty query={query} />
        )}
      </div>
      {rows.length > 0 && <Dock query={query} onQuery={setQuery} />}
    </div>
  );
}
