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
  await fetch("/api/analytics/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ visitorId: getVisitorId(), eventType, tableId, sourcePath: "/menu" }) });
}
export async function submitProfile(name: string, phone: string, tableId?: string) {
  try {
    console.log('[submitProfile] Starting submission:', { name, phone, tableId, visitorId: getVisitorId() });
    
    const response = await fetch("/api/analytics/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorId: getVisitorId(),
        name,
        phone,
        tableId
      })
    });
    
    console.log('[submitProfile] Response received:', { 
      status: response.status, 
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    if (!response.ok) {
      const responseText = await response.text();
      console.error('[submitProfile] Request failed:', {
        status: response.status,
        statusText: response.statusText,
        responseText: responseText
      });
      
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { error: responseText || 'Unknown error' };
      }
      
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('[submitProfile] Success:', result);
    return result;
  } catch (error) {
    console.error('[submitProfile] Exception caught:', error);
    throw error;
  }
}
