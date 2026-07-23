import type { Language } from "./languages";

type LocalizedContent = { name?: string; description?: string };

// Add verified, human-reviewed menu translations here. Unknown content falls back to API text.
export const menuContentTranslations: {
  dishes: Record<number, Partial<Record<Language, LocalizedContent>>>;
  categories: Record<number, Partial<Record<Language, string>>>;
} = {
  dishes: {
    1: {
      hi: { name: "दाल मखनी", description: "मलाईदार काली दाल" },
      pa: { name: "ਦਾਲ ਮੱਖਣੀ", description: "ਮਲਾਈਦਾਰ ਕਾਲੀ ਦਾਲ" },
    },
    2: {
      hi: { name: "पनीर बटर मसाला", description: "मखनी ग्रेवी में पनीर" },
      pa: { name: "ਪਨੀਰ ਬਟਰ ਮਸਾਲਾ", description: "ਮੱਖਣੀ ਗ੍ਰੇਵੀ ਵਿੱਚ ਪਨੀਰ" },
    },
    3: {
      hi: { name: "तंदूरी चिकन", description: "तंदूर में पकाया चिकन" },
      pa: { name: "ਤੰਦੂਰੀ ਚਿਕਨ", description: "ਤੰਦੂਰ ਵਿੱਚ ਪਕਾਇਆ ਚਿਕਨ" },
    },
    4: {
      hi: { name: "बटर नान", description: "मक्खन लगी नरम नान" },
      pa: { name: "ਬਟਰ ਨਾਨ", description: "ਮੱਖਣ ਲੱਗੀ ਨਰਮ ਨਾਨ" },
    },
    5: {
      hi: { name: "जीरा राइस", description: "जीरे से सुगंधित चावल" },
      pa: { name: "ਜੀਰਾ ਰਾਈਸ", description: "ਜੀਰੇ ਨਾਲ ਸੁਗੰਧਿਤ ਚਾਵਲ" },
    },
    6: {
      hi: { name: "लस्सी", description: "ताज़ी मीठी लस्सी" },
      pa: { name: "ਲੱਸੀ", description: "ਤਾਜ਼ੀ ਮਿੱਠੀ ਲੱਸੀ" },
    },
    7: {
      hi: { name: "गुलाब जामुन", description: "चाशनी में डूबे मीठे गोले" },
      pa: { name: "ਗੁਲਾਬ ਜਾਮੁਨ", description: "ਚਾਸ਼ਣੀ ਵਿੱਚ ਡੁੱਬੇ ਮਿੱਠੇ ਗੋਲੇ" },
    },
    8: {
      hi: { name: "पालक पनीर", description: "पालक की ग्रेवी में पनीर" },
      pa: { name: "ਪਾਲਕ ਪਨੀਰ", description: "ਪਾਲਕ ਦੀ ਗ੍ਰੇਵੀ ਵਿੱਚ ਪਨੀਰ" },
    },
    9: {
      hi: { name: "छोले भटूरे", description: "मसालेदार छोले और भटूरे" },
      pa: { name: "ਛੋਲੇ ਭਟੂਰੇ", description: "ਮਸਾਲੇਦਾਰ ਛੋਲੇ ਅਤੇ ਭਟੂਰੇ" },
    },
    10: {
      hi: { name: "सरसों दा साग", description: "मक्के की रोटी के साथ" },
      pa: { name: "ਸਰ੍ਹੋਂ ਦਾ ਸਾਗ", description: "ਮੱਕੇ ਦੀ ਰੋਟੀ ਨਾਲ" },
    },
    11: {
      hi: { name: "मटर पनीर", description: "मटर और पनीर की सब्जी" },
      pa: { name: "ਮਟਰ ਪਨੀਰ", description: "ਮਟਰ ਅਤੇ ਪਨੀਰ ਦੀ ਸਬਜ਼ੀ" },
    },
    12: {
      hi: { name: "आलू परांठा", description: "मसालेदार आलू भरा परांठा" },
      pa: { name: "ਆਲੂ ਪਰਾਠਾ", description: "ਮਸਾਲੇਦਾਰ ਆਲੂ ਭਰਿਆ ਪਰਾਠਾ" },
    },
    13: {
      hi: { name: "मुर्ग मखनी", description: "मखनी ग्रेवी में चिकन" },
      pa: { name: "ਮੁਰਗ ਮੱਖਣੀ", description: "ਮੱਖਣੀ ਗ੍ਰੇਵੀ ਵਿੱਚ ਚਿਕਨ" },
    },
    14: {
      hi: { name: "शाही पनीर", description: "शाही मसालों में पनीर" },
      pa: { name: "ਸ਼ਾਹੀ ਪਨੀਰ", description: "ਸ਼ਾਹੀ ਮਸਾਲਿਆਂ ਵਿੱਚ ਪਨੀਰ" },
    },
    15: {
      hi: { name: "खीर", description: "दूध और चावल की मिठाई" },
      pa: { name: "ਖੀਰ", description: "ਦੁੱਧ ਅਤੇ ਚਾਵਲ ਦੀ ਮਿਠਾਈ" },
    },
  },
  categories: {
    1: { hi: "स्टार्टर", pa: "ਸ਼ੁਰੂਆਤੀ ਪਕਵਾਨ" },
    2: { hi: "मुख्य व्यंजन", pa: "ਮੁੱਖ ਪਕਵਾਨ" },
    3: { hi: "ब्रेड", pa: "ਰੋਟੀ" },
    4: { hi: "चावल", pa: "ਚਾਵਲ" },
    5: { hi: "पेय", pa: "ਪੀਣ ਵਾਲੇ ਪਦਾਰਥ" },
    6: { hi: "मिठाई", pa: "ਮਿਠਾਈ" },
    7: { hi: "सलाद", pa: "ਸਲਾਦ" },
    8: { hi: "सूप", pa: "ਸੂਪ" },
  },
};
