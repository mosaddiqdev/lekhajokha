import { describe, expect, it } from "vitest";
import { describeDay } from "./days";

describe("describeDay", () => {
  it("says today and yesterday", () => {
    expect(describeDay("2026-11-16", "2026-11-16")).toBe("today");
    expect(describeDay("2026-11-15", "2026-11-16")).toBe("yesterday");
  });

  it("counts yesterday across a month and year end", () => {
    expect(describeDay("2026-10-31", "2026-11-01")).toBe("yesterday");
    expect(describeDay("2025-12-31", "2026-01-01")).toBe("yesterday");
  });

  it("gives the day and month otherwise", () => {
    expect(describeDay("2026-11-09", "2026-11-16")).toBe("9 Nov");
    expect(describeDay("2026-09-02", "2026-11-16")).toBe("2 Sep");
  });

  it("adds the year when it is another year", () => {
    expect(describeDay("2025-11-16", "2026-11-16")).toBe("16 Nov 2025");
  });
});
