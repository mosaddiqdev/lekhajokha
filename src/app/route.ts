// Screens live in the URL hash, so the phone's Back button works and a screen
// can be opened directly. #/customer/abc is Ramesh's ledger.

export type Route =
  | { name: "home" }
  | { name: "new"; prefill?: string }
  | { name: "edit"; id: string }
  | { name: "customer"; id: string };

export const paths = {
  home: "#/",
  // The name typed in search is carried over, so "Add Mohan" starts filled in.
  newCustomer: (prefill?: string) =>
    prefill ? `#/new?name=${encodeURIComponent(prefill)}` : "#/new",
  customer: (id: string) => `#/customer/${id}`,
  edit: (id: string) => `#/edit/${id}`,
};

export function parseRoute(hash: string): Route {
  const [path = "", query = ""] = hash.replace(/^#/, "").split("?");
  const [, first, second] = path.split("/");

  if (first === "new") {
    const prefill = new URLSearchParams(query).get("name") ?? undefined;
    return prefill ? { name: "new", prefill } : { name: "new" };
  }
  if (first === "customer" && second) return { name: "customer", id: second };
  if (first === "edit" && second) return { name: "edit", id: second };
  return { name: "home" };
}

// Going deeper slides in from the right, going up slides back.
export function depth(route: Route): number {
  return route.name === "home" ? 0 : 1;
}
