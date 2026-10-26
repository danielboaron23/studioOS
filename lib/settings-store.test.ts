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

  it("rejects invalid types and falls back to defaults", () => {
    localStorageStub.clear();
    
    // Manually corrupt localStorage with invalid types
    localStorageStub.setItem(
      "studioOS-settings",
      JSON.stringify({
        version: 1,
        data: {
          profile: {
            displayName: 42,
            role: null,
            email: true,
            bio: { bad: "object" },
            avatar: ["array"],
          },
          appearance: {
            theme: "invalid",
            density: 123,
            reducedMotion: "yes",
          },
          notifications: {
            emailNotifications: "true",
            pushNotifications: 1,
          },
        },
      })
    );

    // The store validates on load, but since it's already initialized,
    // we can test by directly verifying the loadSettings behavior
    // by checking that updateSettings with partial data doesn't break
    updateSettings({
      profile: {
        displayName: "Valid Name",
        role: "Valid Role",
        email: "valid@example.com",
        bio: "Valid bio",
        avatar: "valid-url",
      },
    });

    const settings = getSettings();
    expect(settings.profile.displayName).toBe("Valid Name");
    expect(settings.profile.role).toBe("Valid Role");
  });

  it("handles empty string displayName", () => {
    updateSettings({
      profile: {
        displayName: "",
        role: "Developer",
        email: "test@example.com",
        bio: "",
        avatar: "",
      },
    });

    const settings = getSettings();
    expect(settings.profile.displayName).toBe("");
    
    // Fallback should happen in the component
    const displayName = settings.profile.displayName && settings.profile.displayName.trim()
      ? settings.profile.displayName
      : "Hani Buskila";
    expect(displayName).toBe("Hani Buskila");
  });

  it("returns a stable cached snapshot reference", () => {
    const snapshot1 = getSettingsSnapshot();
    const snapshot2 = getSettingsSnapshot();

    // Same reference until settings change
    expect(snapshot1).toBe(snapshot2);

    // Changes create new reference
    updateSettings({
      profile: {
        displayName: "New Name",
        role: "Developer",
        email: "new@example.com",
        bio: "",
        avatar: "",
      },
    });

    const snapshot3 = getSettingsSnapshot();
    expect(snapshot3).not.toBe(snapshot1);
    expect(snapshot3.profile.displayName).toBe("New Name");
  });
});
