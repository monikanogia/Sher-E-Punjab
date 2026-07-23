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

const hi: Partial<Dictionary> = { chooseLanguage: "भाषा चुनें", welcome: "स्वागत है", welcomeMessage: "अधिक व्यक्तिगत सेवा के लिए अपना विवरण साझा करें।", name: "नाम", phone: "फ़ोन", continue: "आगे बढ़ें", saving: "सहेजा जा रहा है...", callWaiter: "वेटर बुलाएं", payNow: "अभी भुगतान करें", searchDishes: "व्यंजन खोजें...", all: "सभी", veg: "शाकाहारी", items: "आइटम", resultsFor: "के लिए परिणाम", noDishesFound: "कोई व्यंजन नहीं मिला", noItemsAvailable: "कोई आइटम उपलब्ध नहीं", viewCart: "कार्ट देखें", yourCart: "आपकी कार्ट", total: "कुल", placeOrder: "व्हाट्सएप के माध्यम से ऑर्डर करें", clearCart: "कार्ट साफ़ करें", categories: "श्रेणियां", scanAndPay: "स्कैन करें और भुगतान करें", openUpi: "भुगतान के लिए UPI ऐप खोलें", pageNotFound: "पेज नहीं मिला", goHome: "होम जाएं", chefsSpecial: "शेफ की विशेष", viewFullMenu: "पूरा मेनू देखें", openNow: "अभी खुला है", closed: "बंद", loading: "लोड हो रहा है..." };
const pa: Partial<Dictionary> = { chooseLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ", welcome: "ਜੀ ਆਇਆਂ ਨੂੰ", welcomeMessage: "ਵਧੇਰੇ ਨਿੱਜੀ ਸੇਵਾ ਲਈ ਆਪਣੇ ਵੇਰਵੇ ਸਾਂਝੇ ਕਰੋ।", name: "ਨਾਮ", phone: "ਫ਼ੋਨ", continue: "ਜਾਰੀ ਰੱਖੋ", saving: "ਸੰਭਾਲਿਆ ਜਾ ਰਿਹਾ ਹੈ...", callWaiter: "ਵੇਟਰ ਨੂੰ ਬੁਲਾਓ", payNow: "ਹੁਣੇ ਭੁਗਤਾਨ ਕਰੋ", searchDishes: "ਪਕਵਾਨ ਖੋਜੋ...", all: "ਸਾਰੇ", veg: "ਸ਼ਾਕਾਹਾਰੀ", items: "ਆਈਟਮ", resultsFor: "ਲਈ ਨਤੀਜੇ", noDishesFound: "ਕੋਈ ਪਕਵਾਨ ਨਹੀਂ ਮਿਲਿਆ", noItemsAvailable: "ਕੋਈ ਆਈਟਮ ਉਪਲਬਧ ਨਹੀਂ", viewCart: "ਕਾਰਟ ਵੇਖੋ", yourCart: "ਤੁਹਾਡੀ ਕਾਰਟ", total: "ਕੁੱਲ", placeOrder: "ਵਟਸਐਪ ਰਾਹੀਂ ਆਰਡਰ ਕਰੋ", clearCart: "ਕਾਰਟ ਸਾਫ਼ ਕਰੋ", categories: "ਸ਼੍ਰੇਣੀਆਂ", scanAndPay: "ਸਕੈਨ ਕਰੋ ਅਤੇ ਭੁਗਤਾਨ ਕਰੋ", openUpi: "ਭੁਗਤਾਨ ਲਈ UPI ਐਪ ਖੋਲ੍ਹੋ", pageNotFound: "ਸਫ਼ਾ ਨਹੀਂ ਮਿਲਿਆ", goHome: "ਹੋਮ ਜਾਓ", chefsSpecial: "ਸ਼ੈੱਫ ਦੇ ਖਾਸ", viewFullMenu: "ਪੂਰਾ ਮੀਨੂ ਵੇਖੋ", openNow: "ਹੁਣ ਖੁੱਲ੍ਹਾ ਹੈ", closed: "ਬੰਦ", loading: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ..." };
const gu: Partial<Dictionary> = { chooseLanguage: "ભાષા પસંદ કરો", welcome: "સ્વાગત છે", welcomeMessage: "વધુ વ્યક્તિગત સેવા માટે તમારી વિગતો શેર કરો.", name: "નામ", phone: "ફોન", continue: "ચાલુ રાખો", saving: "સાચવાઈ રહ્યું છે...", callWaiter: "વેઈટરને બોલાવો", payNow: "હમણાં ચૂકવો", searchDishes: "વાનગીઓ શોધો...", all: "બધા", veg: "શાકાહારી", items: "વસ્તુઓ", resultsFor: "માટે પરિણામો", noDishesFound: "કોઈ વાનગી મળી નથી", noItemsAvailable: "કોઈ વસ્તુઓ ઉપલબ્ધ નથી", viewCart: "કાર્ટ જુઓ", yourCart: "તમારી કાર્ટ", total: "કુલ", placeOrder: "વોટ્સએપ દ્વારા ઓર્ડર કરો", clearCart: "કાર્ટ સાફ કરો", categories: "શ્રેણીઓ", scanAndPay: "સ્કેન કરો અને ચૂકવો", openUpi: "ચુકવણી માટે UPI એપ ખોલો", pageNotFound: "પાનું મળ્યું નથી", goHome: "હોમ જાઓ", chefsSpecial: "શેફની ખાસ", viewFullMenu: "સંપૂર્ણ મેનુ જુઓ", openNow: "હમણાં ખુલ્લું છે", closed: "બંધ", loading: "લોડ થઈ રહ્યું છે..." };
const sd: Partial<Dictionary> = { chooseLanguage: "ٻولي چونڊيو", welcome: "ڀليڪار", welcomeMessage: "وڌيڪ ذاتي خدمت لاءِ پنهنجا تفصيل شيئر ڪريو.", name: "نالو", phone: "فون", continue: "جاري رکو", saving: "محفوظ ٿي رهيو آهي...", callWaiter: "ويٽر کي سڏيو", payNow: "هاڻي ادا ڪريو", searchDishes: "ڀاڄيون ڳوليو...", all: "سڀ", veg: "ڀاڄين وارو", items: "شيون", resultsFor: "لاءِ نتيجا", noDishesFound: "ڪا به ڀاڄي نه ملي", noItemsAvailable: "ڪا به شيون موجود ناهن", viewCart: "ڪارٽ ڏسو", yourCart: "توهان جي ڪارٽ", total: "ڪل", placeOrder: "واٽس ايپ ذريعي آرڊر ڪريو", clearCart: "ڪارٽ صاف ڪريو", categories: "زمرا", scanAndPay: "اسڪين ڪريو ۽ ادا ڪريو", openUpi: "ادائيگي لاءِ UPI ايپ کوليو", pageNotFound: "صفحو نه مليو", goHome: "هوم وڃو", chefsSpecial: "شيف جي خاص", viewFullMenu: "مڪمل مينيو ڏسو", openNow: "هاڻي کليل آهي", closed: "بند", loading: "لوڊ ٿي رهيو آهي..." };
const mwr: Partial<Dictionary> = { chooseLanguage: "भासा चुनो", welcome: "पधारो सा", welcomeMessage: "बेहतर सेवा खातर आपरी जानकारी बताओ.", name: "नाम", phone: "फोन", continue: "आगै बढ़ो", saving: "सहेज रया हैं...", callWaiter: "वेटर बुलाओ", payNow: "अभी भुगतान करो", searchDishes: "व्यंजन खोजो...", all: "सगळा", veg: "शाकाहारी", items: "आइटम", resultsFor: "खातर नतीजा", noDishesFound: "कोई व्यंजन कोनी मिल्यो", noItemsAvailable: "कोई आइटम उपलब्ध कोनी", viewCart: "कार्ट देखो", yourCart: "थारी कार्ट", total: "कुल", placeOrder: "व्हाट्सएप माध्यम सूं आर्डर करो", clearCart: "कार्ट साफ करो", categories: "श्रेणियां", scanAndPay: "स्कैन करो अर भुगतान करो", openUpi: "भुगतान खातर UPI एप खोलो", pageNotFound: "पन्नो कोनी मिल्यो", goHome: "होम जाओ", chefsSpecial: "शेफ री खास", viewFullMenu: "पूरो मेनू देखो", openNow: "अभी खुल्यो है", closed: "बंद", loading: "लोड हो रयो है..." };

export const translations: Record<Language, Dictionary> = {
  en,
  hi: { ...en, ...hi },
  pa: { ...en, ...pa },
  gu: { ...en, ...gu },
  sd: { ...en, ...sd },
  mwr: { ...en, ...mwr },
};

export type { TranslationKey };
