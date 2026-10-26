import { describe, it, expect, beforeEach } from "vitest";

// Manual stubs for node environment
const localStorageStub = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    clear: () => { store = {}; },
  };
})();

const matchMediaStub = () => ({
  matches: false,
  addEventListener: () => {},
  removeEventListener: () => {},
});

const documentStub = {
  documentElement: {
    classList: {
      _dark: false,
      contains: (cls: string) => cls === "dark" && documentStub.documentElement.classList._dark,
      add: (cls: string) => { if (cls === "dark") documentStub.documentElement.classList._dark = true; },
      remove: (cls: string) => { if (cls === "dark") documentStub.documentElement.classList._dark = false; },
      toggle: (cls: string, force?: boolean) => {
        if (cls === "dark") {
          if (force === undefined) {
            documentStub.documentElement.classList._dark = !documentStub.documentElement.classList._dark;
          } else {
            documentStub.documentElement.classList._dark = force;
          }
        }
      },
    },
  },
};

global.localStorage = localStorageStub as Storage;
global.window = { matchMedia: matchMediaStub } as unknown as Window & typeof globalThis;
global.document = documentStub as unknown as Document;

import { getTheme, setTheme, subscribeTheme, getThemeSnapshot } from "./theme";

describe("theme", () => {
  beforeEach(() => {
    localStorageStub.clear();
    documentStub.documentElement.classList._dark = false;
  });

  it("defaults to system theme", () => {
    const theme = getTheme();
    expect(theme).toBe("system");
  });

  it("sets and persists theme", () => {
    setTheme("dark");
    expect(getTheme()).toBe("dark");
    expect(localStorageStub.getItem("theme")).toBe("dark");
  });

  it("applies dark class when theme is dark", () => {
    setTheme("dark");
    expect(documentStub.documentElement.classList.contains("dark")).toBe(true);
  });

  it("removes dark class when theme is light", () => {
    documentStub.documentElement.classList.add("dark");
    setTheme("light");
    expect(documentStub.documentElement.classList.contains("dark")).toBe(false);
  });

  it("notifies subscribers on theme change", () => {
    let notified = false;
    const unsubscribe = subscribeTheme(() => {
      notified = true;
    });

    setTheme("dark");
    expect(notified).toBe(true);
    unsubscribe();
  });

  it("can unsubscribe listeners", () => {
    let callCount = 0;
    const unsubscribe = subscribeTheme(() => {
      callCount++;
    });

    setTheme("dark");
    expect(callCount).toBe(1);

    unsubscribe();

    setTheme("light");
    expect(callCount).toBe(1);
  });

  it("getThemeSnapshot returns current theme", () => {
    setTheme("light");
    const snapshot = getThemeSnapshot();
    expect(snapshot).toBe("light");
  });

  it("supports system theme", () => {
    setTheme("system");
    expect(getTheme()).toBe("system");
  });
});
