import type { Language } from "./languages";

type TranslationKey =
  | "chooseLanguage" | "welcome" | "welcomeMessage" | "name" | "phone" | "continue" | "saving"
  | "callWaiter" | "payNow" | "searchDishes" | "all" | "veg" | "items" | "resultsFor"
  | "noDishesFound" | "noItemsAvailable" | "viewCart" | "yourCart" | "total" | "placeOrder"
  | "clearCart" | "categories" | "scanAndPay" | "openUpi" | "pageNotFound" | "goHome"
  | "chefsSpecial" | "viewFullMenu" | "openNow" | "closed" | "loading";

type Dictionary = Record<TranslationKey, string>;

const en: Dictionary = {
  chooseLanguage: "Choose language", welcome: "Welcome", welcomeMessage: "Share your details for a more personal service.", name: "Name", phone: "Phone", continue: "Continue", saving: "Saving...",
  callWaiter: "Call Waiter", payNow: "Pay Now", searchDishes: "Search dishes...", all: "All", veg: "Veg", items: "items", resultsFor: "results for", noDishesFound: "No dishes found", noItemsAvailable: "No items available",
  viewCart: "View Cart", yourCart: "Your Cart", total: "Total", placeOrder: "Place Order via WhatsApp", clearCart: "Clear Cart", categories: "Categories", scanAndPay: "Scan & Pay", openUpi: "Open UPI App to Pay",
  pageNotFound: "Page not found", goHome: "Go Home", chefsSpecial: "Chef's Specials", viewFullMenu: "View Full Menu", openNow: "Open Now", closed: "Closed", loading: "Loading...",
};

const hi: Partial<Dictionary> = { chooseLanguage: "भाषा चुनें", welcome: "स्वागत है", name: "नाम", phone: "फ़ोन", continue: "आगे बढ़ें", saving: "सहेजा जा रहा है...", callWaiter: "वेटर बुलाएं", payNow: "अभी भुगतान करें", searchDishes: "व्यंजन खोजें...", all: "सभी", veg: "शाकाहारी", items: "आइटम", viewCart: "कार्ट देखें", yourCart: "आपकी कार्ट", total: "कुल", clearCart: "कार्ट साफ़ करें", categories: "श्रेणियां", pageNotFound: "पेज नहीं मिला", goHome: "होम जाएं" };
const pa: Partial<Dictionary> = { chooseLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ", welcome: "ਜੀ ਆਇਆਂ ਨੂੰ", name: "ਨਾਮ", phone: "ਫ਼ੋਨ", continue: "ਜਾਰੀ ਰੱਖੋ", saving: "ਸੰਭਾਲਿਆ ਜਾ ਰਿਹਾ ਹੈ...", callWaiter: "ਵੇਟਰ ਨੂੰ ਬੁਲਾਓ", payNow: "ਹੁਣੇ ਭੁਗਤਾਨ ਕਰੋ", searchDishes: "ਪਕਵਾਨ ਖੋਜੋ...", all: "ਸਾਰੇ", veg: "ਸ਼ਾਕਾਹਾਰੀ", items: "ਆਈਟਮ", viewCart: "ਕਾਰਟ ਵੇਖੋ", yourCart: "ਤੁਹਾਡੀ ਕਾਰਟ", total: "ਕੁੱਲ", clearCart: "ਕਾਰਟ ਸਾਫ਼ ਕਰੋ", categories: "ਸ਼੍ਰੇਣੀਆਂ", pageNotFound: "ਸਫ਼ਾ ਨਹੀਂ ਮਿਲਿਆ", goHome: "ਹੋਮ ਜਾਓ" };
const gu: Partial<Dictionary> = { chooseLanguage: "ભાષા પસંદ કરો", welcome: "સ્વાગત છે", name: "નામ", phone: "ફોન", continue: "ચાલુ રાખો", saving: "સાચવાઈ રહ્યું છે...", callWaiter: "વેઈટરને બોલાવો", payNow: "હમણાં ચૂકવો", searchDishes: "વાનગીઓ શોધો...", all: "બધા", veg: "શાકાહારી", items: "વસ્તુઓ", viewCart: "કાર્ટ જુઓ", yourCart: "તમારી કાર્ટ", total: "કુલ", clearCart: "કાર્ટ સાફ કરો", categories: "શ્રેણીઓ", pageNotFound: "પાનું મળ્યું નથી", goHome: "હોમ જાઓ" };
const sd: Partial<Dictionary> = { chooseLanguage: "ٻولي چونڊيو", welcome: "ڀليڪار", name: "نالو", phone: "فون", continue: "جاري رکو", saving: "محفوظ ٿي رهيو آهي...", callWaiter: "ويٽر کي سڏيو", payNow: "هاڻي ادا ڪريو", searchDishes: "ڀاڄيون ڳوليو...", all: "سڀ", veg: "ڀاڄين وارو", items: "شيون", viewCart: "ڪارٽ ڏسو", yourCart: "توهان جي ڪارٽ", total: "ڪل", clearCart: "ڪارٽ صاف ڪريو", categories: "زمرا", pageNotFound: "صفحو نه مليو", goHome: "هوم وڃو" };
const mwr: Partial<Dictionary> = { chooseLanguage: "भासा चुनो", welcome: "पधारो सा", name: "नाम", phone: "फोन", continue: "आगै बढ़ो", saving: "सहेज रया हैं...", callWaiter: "वेटर बुलाओ", payNow: "अभी भुगतान करो", searchDishes: "व्यंजन खोजो...", all: "सगळा", veg: "शाकाहारी", items: "आइटम", viewCart: "कार्ट देखो", yourCart: "थारी कार्ट", total: "कुल", clearCart: "कार्ट साफ करो", categories: "श्रेणियां", pageNotFound: "पन्नो कोनी मिल्यो", goHome: "होम जाओ" };

export const translations: Record<Language, Dictionary> = {
  en,
  hi: { ...en, ...hi },
  pa: { ...en, ...pa },
  gu: { ...en, ...gu },
  sd: { ...en, ...sd },
  mwr: { ...en, ...mwr },
};

export type { TranslationKey };
