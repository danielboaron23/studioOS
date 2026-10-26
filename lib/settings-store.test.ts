import { describe, it, expect, beforeEach } from "vitest";

// Manual localStorage stub for node environment
const localStorageStub = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    clear: () => { store = {}; },
  };
})();

global.localStorage = localStorageStub as Storage;

import {
  getSettings,
  updateSettings,
  subscribeSettings,
  getSettingsSnapshot,
} from "./settings-store";

describe("settings-store", () => {
  beforeEach(() => {
    localStorageStub.clear();
  });

  it("returns default settings initially", () => {
    const settings = getSettings();
    expect(settings.profile.displayName).toBe("Hani Buskila");
    expect(settings.profile.role).toBe("Product Designer");
    expect(settings.appearance.theme).toBe("system");
    expect(settings.appearance.density).toBe("comfortable");
  });

  it("updates and persists profile settings", () => {
    updateSettings({
      profile: {
        displayName: "Test User",
        role: "Developer",
        email: "test@example.com",
        bio: "Test bio",
        avatar: "",
      },
    });

    const settings = getSettings();
    expect(settings.profile.displayName).toBe("Test User");
    expect(settings.profile.role).toBe("Developer");
  });

  it("updates partial settings without overwriting others", () => {
    updateSettings({
      profile: {
        displayName: "Initial Name",
        role: "Initial Role",
        email: "initial@example.com",
        bio: "",
        avatar: "",
      },
    });

    updateSettings({
      profile: {
        displayName: "Updated Name",
        role: "Initial Role",
        email: "initial@example.com",
        bio: "",
        avatar: "",
      },
    });

    const settings = getSettings();
    expect(settings.profile.displayName).toBe("Updated Name");
    expect(settings.profile.role).toBe("Initial Role");
    expect(settings.appearance.theme).toBe("system");
  });

  it("notifies subscribers on update", () => {
    let notified = false;
    const unsubscribe = subscribeSettings(() => {
      notified = true;
    });

    updateSettings({
      appearance: {
        theme: "dark",
        density: "comfortable",
        reducedMotion: false,
      },
    });

    expect(notified).toBe(true);
    unsubscribe();
  });

  it("can unsubscribe listeners", () => {
    let callCount = 0;
    const unsubscribe = subscribeSettings(() => {
      callCount++;
    });

    updateSettings({
      appearance: {
        theme: "dark",
        density: "comfortable",
        reducedMotion: false,
      },
    });
    expect(callCount).toBe(1);

    unsubscribe();

    updateSettings({
      appearance: {
        theme: "light",
        density: "comfortable",
        reducedMotion: false,
      },
    });
    expect(callCount).toBe(1);
  });

  it("getSettingsSnapshot returns current settings", () => {
    updateSettings({
      profile: {
        displayName: "Snapshot Test",
        role: "Tester",
        email: "snapshot@example.com",
        bio: "",
        avatar: "",
      },
    });

    const snapshot = getSettingsSnapshot();
    expect(snapshot.profile.displayName).toBe("Snapshot Test");
  });
});
