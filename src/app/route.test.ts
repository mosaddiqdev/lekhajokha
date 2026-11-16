import { describe, expect, it } from "vitest";
import { parseRoute, paths } from "./route";

describe("parseRoute", () => {
  it("opens Home for an empty or unknown hash", () => {
    expect(parseRoute("")).toEqual({ name: "home" });
    expect(parseRoute("#/")).toEqual({ name: "home" });
    expect(parseRoute("#/nowhere")).toEqual({ name: "home" });
    expect(parseRoute("#/customer")).toEqual({ name: "home" });
  });

  it("reads a customer and the edit form", () => {
    expect(parseRoute("#/customer/abc")).toEqual({ name: "customer", id: "abc" });
    expect(parseRoute("#/edit/abc")).toEqual({ name: "edit", id: "abc" });
  });

  it("reads the new form with and without a name", () => {
    expect(parseRoute("#/new")).toEqual({ name: "new" });
    expect(parseRoute("#/new?name=Mohan%20Das")).toEqual({
      name: "new",
      prefill: "Mohan Das",
    });
  });

  it("round-trips the paths it makes", () => {
    expect(parseRoute(paths.newCustomer("Mohan & Sons"))).toEqual({
      name: "new",
      prefill: "Mohan & Sons",
    });
    expect(parseRoute(paths.customer("x1"))).toEqual({ name: "customer", id: "x1" });
    expect(parseRoute(paths.edit("x1"))).toEqual({ name: "edit", id: "x1" });
  });
});
