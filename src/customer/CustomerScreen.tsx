import { useLiveQuery } from "dexie-react-hooks";
import { paths, type Route } from "../app/route";
import { getCustomerBaki } from "../data/customerBaki";
import { TopBar } from "../ui/TopBar";
import { CustomerForm } from "./CustomerForm";
import { CustomerStub } from "./CustomerStub";

type Props = { route: Extract<Route, { name: "new" | "edit" | "customer" }> };

// Finds the customer for edit and ledger. A missing one means a stale link.
export function CustomerScreen({ route }: Props) {
  const id = route.name === "new" ? undefined : route.id;
  const found = useLiveQuery(
    async () => (id ? ((await getCustomerBaki(id)) ?? null) : undefined),
    [id],
  );

  if (route.name === "new") return <CustomerForm key="new" prefill={route.prefill} />;
  if (found === undefined) return null;
  if (found === null) {
    return (
      <>
        <TopBar title="Customer not found" back={paths.home} />
        <p style={{ padding: "0 var(--space-4)", color: "var(--text-quiet)" }}>
          This customer was deleted or the link is old.
        </p>
      </>
    );
  }
  return route.name === "edit" ? (
    <CustomerForm key={found.customer.id} existing={found} />
  ) : (
    <CustomerStub row={found} />
  );
}
