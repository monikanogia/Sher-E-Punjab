export type CustomerProfile = { name: string; expiresAt: number };
const PROFILE_KEY = "menu_customer_profile";
const DISMISSED_KEY = "menu_welcome_dismissed_at";
const VISITOR_KEY = "menu_visitor_id";
const DAY = 24 * 60 * 60 * 1000;

export function getVisitorId() {
  let visitorId = localStorage.getItem(VISITOR_KEY);
  if (!visitorId) { visitorId = crypto.randomUUID(); localStorage.setItem(VISITOR_KEY, visitorId); }
  return visitorId;
}
export function getActiveProfile(): CustomerProfile | null {
  const value = localStorage.getItem(PROFILE_KEY);
  if (!value) return null;
  try { const profile = JSON.parse(value) as CustomerProfile; if (profile.expiresAt > Date.now()) return profile; } catch { /* remove malformed data */ }
  localStorage.removeItem(PROFILE_KEY); return null;
}
export function shouldShowWelcome() {
  if (getActiveProfile()) return false;
  const dismissedAt = Number(localStorage.getItem(DISMISSED_KEY));
  return !dismissedAt || dismissedAt + DAY <= Date.now();
}
export function saveProfile(name: string) { localStorage.setItem(PROFILE_KEY, JSON.stringify({ name, expiresAt: Date.now() + DAY })); localStorage.removeItem(DISMISSED_KEY); }
export function dismissWelcome() { localStorage.setItem(DISMISSED_KEY, String(Date.now())); }
export async function trackEvent(eventType: "visit" | "qr_scan", tableId?: string) {
  await fetch("/api/analytics/events", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ visitorId: getVisitorId(), eventType, tableId, sourcePath: "/menu" }) });
}
export async function submitProfile(name: string, phone: string, tableId?: string) {
  const response = await fetch("/api/analytics/profile", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ visitorId: getVisitorId(), name, phone, tableId }) });
  if (!response.ok) throw new Error("Unable to save profile");
}
