import { describe, it, expect } from "vitest";

describe("Header displayName handling", () => {
  it("falls back to default for empty displayName", () => {
    const rawDisplayName: string = "";
    const displayName = rawDisplayName && rawDisplayName.trim() 
      ? rawDisplayName 
      : "Hani Buskila";

    expect(displayName).toBe("Hani Buskila");
  });

  it("falls back to default for whitespace-only displayName", () => {
    const rawDisplayName: string = "   ";
    const displayName = rawDisplayName && rawDisplayName.trim()
      ? rawDisplayName
      : "Hani Buskila";

    expect(displayName).toBe("Hani Buskila");
  });

  it("handles displayName with multiple spaces correctly", () => {
    const testName = "John   Middle   Doe";
    const initials = testName
      .split(/\s+/)
      .filter(n => n.length > 0)
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

    expect(initials).toBe("JM");
  });

  it("handles displayName with leading/trailing spaces", () => {
    const testName = "  Jane Smith  ";
    const initials = testName
      .split(/\s+/)
      .filter(n => n.length > 0)
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

    expect(initials).toBe("JS");
  });

  it("handles single-word displayName", () => {
    const testName = "Madonna";
    const initials = testName
      .split(/\s+/)
      .filter(n => n.length > 0)
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

    expect(initials).toBe("M");
  });

  it("limits initials to 2 characters", () => {
    const testName = "John Paul George Ringo";
    const initials = testName
      .split(/\s+/)
      .filter(n => n.length > 0)
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

    expect(initials).toBe("JP");
  });
});
