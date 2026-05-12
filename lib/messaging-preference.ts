"use client";

export type MessagingPlatform = "messenger" | "whatsapp" | null;

const MESSAGING_PREFERENCE_KEY = "user_messaging_preference";

export function getMessagingPreference(): MessagingPlatform {
  if (typeof window === "undefined") return null;
  
  try {
    const stored = localStorage.getItem(MESSAGING_PREFERENCE_KEY);
    return stored as MessagingPlatform;
  } catch {
    return null;
  }
}

export function setMessagingPreference(platform: MessagingPlatform): void {
  if (typeof window === "undefined") return;
  
  try {
    if (platform) {
      localStorage.setItem(MESSAGING_PREFERENCE_KEY, platform);
    } else {
      localStorage.removeItem(MESSAGING_PREFERENCE_KEY);
    }
  } catch {
    // Silently fail if localStorage is not available
  }
}

export function getPreferredPlatform(
  hasMessenger: boolean,
  hasWhatsApp: boolean
): "messenger" | "whatsapp" | null {
  const userPreference = getMessagingPreference();
  
  // If user has a preference and it's available, use it
  if (userPreference === "messenger" && hasMessenger) return "messenger";
  if (userPreference === "whatsapp" && hasWhatsApp) return "whatsapp";
  
  // Fallback: prioritize based on device
  if (hasMessenger && hasWhatsApp) {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    return isMobile ? "whatsapp" : "messenger";
  }
  
  // Single option available
  if (hasMessenger) return "messenger";
  if (hasWhatsApp) return "whatsapp";
  
  return null;
}
