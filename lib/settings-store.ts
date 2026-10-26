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
let cachedSnapshot: Settings = settings;
const listeners = new Set<(settings: Settings) => void>();

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

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

    const data = parsed.data;
    
    return {
      profile: {
        displayName: isString(data.profile?.displayName) ? data.profile.displayName : defaultSettings.profile.displayName,
        role: isString(data.profile?.role) ? data.profile.role : defaultSettings.profile.role,
        email: isString(data.profile?.email) ? data.profile.email : defaultSettings.profile.email,
        bio: isString(data.profile?.bio) ? data.profile.bio : defaultSettings.profile.bio,
        avatar: isString(data.profile?.avatar) ? data.profile.avatar : defaultSettings.profile.avatar,
      },
      appearance: {
        theme: (data.appearance?.theme === "light" || data.appearance?.theme === "dark" || data.appearance?.theme === "system") 
          ? data.appearance.theme 
          : defaultSettings.appearance.theme,
        density: (data.appearance?.density === "comfortable" || data.appearance?.density === "compact")
          ? data.appearance.density
          : defaultSettings.appearance.density,
        reducedMotion: isBoolean(data.appearance?.reducedMotion) ? data.appearance.reducedMotion : defaultSettings.appearance.reducedMotion,
      },
      notifications: {
        emailNotifications: isBoolean(data.notifications?.emailNotifications) ? data.notifications.emailNotifications : defaultSettings.notifications.emailNotifications,
        pushNotifications: isBoolean(data.notifications?.pushNotifications) ? data.notifications.pushNotifications : defaultSettings.notifications.pushNotifications,
        weeklyDigest: isBoolean(data.notifications?.weeklyDigest) ? data.notifications.weeklyDigest : defaultSettings.notifications.weeklyDigest,
        projectUpdates: isBoolean(data.notifications?.projectUpdates) ? data.notifications.projectUpdates : defaultSettings.notifications.projectUpdates,
      },
      workspace: {
        workspaceName: isString(data.workspace?.workspaceName) ? data.workspace.workspaceName : defaultSettings.workspace.workspaceName,
        workspaceLogo: isString(data.workspace?.workspaceLogo) ? data.workspace.workspaceLogo : defaultSettings.workspace.workspaceLogo,
        defaultProject: isString(data.workspace?.defaultProject) ? data.workspace.defaultProject : defaultSettings.workspace.defaultProject,
      },
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
  cachedSnapshot = settings;
  saveSettings(settings);
  notifyListeners();
}

export function subscribeSettings(listener: (settings: Settings) => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSettingsSnapshot(): Settings {
  return cachedSnapshot;
}

function getDefaultSettingsSnapshot(): Settings {
  return defaultSettings;
}

// Initialize on client
if (typeof window !== "undefined") {
  settings = loadSettings();
  cachedSnapshot = settings;
}

export { getDefaultSettingsSnapshot };
