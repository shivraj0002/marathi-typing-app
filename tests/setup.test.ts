import { describe, it, expect } from "vitest";

describe("Environment Setup", () => {
  it("runs vitest successfully in node environment", () => {
    expect(1 + 1).toBe(2);
  });
});
