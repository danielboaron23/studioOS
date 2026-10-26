"use client";

export interface ProfileSettings {
  displayName: string;
  role: string;
  email: string;
  bio: string;
  avatar: string;
}

export interface AppearanceSettings {
  theme: "light" | "dark" | "system";
  density: "comfortable" | "compact";
  reducedMotion: boolean;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  projectUpdates: boolean;
}

export interface WorkspaceSettings {
  workspaceName: string;
  workspaceLogo: string;
  defaultProject: string;
}

export interface Settings {
  profile: ProfileSettings;
  appearance: AppearanceSettings;
  notifications: NotificationSettings;
  workspace: WorkspaceSettings;
}

const STORAGE_KEY = "studioOS-settings";
const STORAGE_VERSION = 1;

const defaultSettings: Settings = {
  profile: {
    displayName: "Hani Buskila",
    role: "Product Designer",
    email: "hani@studioos.com",
    bio: "",
    avatar: "",
  },
  appearance: {
    theme: "system",
    density: "comfortable",
    reducedMotion: false,
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    projectUpdates: true,
  },
  workspace: {
    workspaceName: "Studio OS",
    workspaceLogo: "",
    defaultProject: "",
  },
};

let settings: Settings = { ...defaultSettings };
const listeners = new Set<(settings: Settings) => void>();

function loadSettings(): Settings {
  if (typeof localStorage === "undefined") {
    return { ...defaultSettings };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { ...defaultSettings };

    const parsed = JSON.parse(stored);
    if (parsed.version !== STORAGE_VERSION) {
      return { ...defaultSettings };
    }

    return {
      profile: { ...defaultSettings.profile, ...parsed.data.profile },
      appearance: { ...defaultSettings.appearance, ...parsed.data.appearance },
      notifications: { ...defaultSettings.notifications, ...parsed.data.notifications },
      workspace: { ...defaultSettings.workspace, ...parsed.data.workspace },
    };
  } catch {
    return { ...defaultSettings };
  }
}

function saveSettings(newSettings: Settings) {
  if (typeof localStorage === "undefined") return;

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: STORAGE_VERSION,
        data: newSettings,
      })
    );
  } catch (err) {
    console.error("Failed to save settings:", err);
  }
}

function notifyListeners() {
  listeners.forEach((listener) => listener(settings));
}

export function getSettings(): Settings {
  return settings;
}

export function updateSettings(partial: Partial<Settings>) {
  settings = {
    profile: { ...settings.profile, ...(partial.profile || {}) },
    appearance: { ...settings.appearance, ...(partial.appearance || {}) },
    notifications: { ...settings.notifications, ...(partial.notifications || {}) },
    workspace: { ...settings.workspace, ...(partial.workspace || {}) },
  };
  saveSettings(settings);
  notifyListeners();
}

export function subscribeSettings(listener: (settings: Settings) => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSettingsSnapshot(): Settings {
  return settings;
}

// Initialize on client
if (typeof window !== "undefined") {
  settings = loadSettings();
}
