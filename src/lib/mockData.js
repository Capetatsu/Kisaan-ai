// Mock data for an Indian village farmer use case — frontend presentation only.

export const farmer = {
  name: 'Ramesh',
  village: 'Dharampuri',
  district: 'Indore, MP',
  avatar: 'https://images.unsplash.com/photo-1599564903643-d2c4a0a5a2c2?w=200&h=200&fit=crop',
};

export const weather = {
  temp: 31,
  condition: 'Rain expected',
  conditionHi: 'बारिश संभावित',
  rainChance: 78,
  humidity: 82,
  wind: 12,
  impact: 'Hold spraying — rain in 3 hrs',
  impactHi: 'छिड़काव रोकें — 3 घंटे में बारिश',
  icon: 'cloud-rain',
};

export const aiRecommendation = {
  title: 'Delay spraying',
  titleHi: 'छिड़काव टालें',
  reason: 'Rain expected today',
  reasonHi: 'आज बारिश की संभावना',
  confidence: 92,
  action: 'View why',
  tone: 'wait',
};

export const crops = [
  { id: 1, name: 'Wheat', nameHi: 'गेहूं', stage: 'Flowering', health: 78, water: 'medium', disease: 'low', nextAction: 'Check leaf', emoji: '🌾', color: 'amber' },
  { id: 2, name: 'Tomato', nameHi: 'टमाटर', stage: 'Fruiting', health: 62, water: 'high', disease: 'high', nextAction: 'Spray tomorrow', emoji: '🍅', color: 'red' },
  { id: 3, name: 'Onion', nameHi: 'प्याज', stage: 'Bulbing', health: 88, water: 'low', disease: 'low', nextAction: 'Harvest soon', emoji: '🧅', color: 'violet' },
  { id: 4, name: 'Soybean', nameHi: 'सोयाबीन', stage: 'Vegetative', health: 71, water: 'medium', disease: 'medium', nextAction: 'Water now', emoji: '🫘', color: 'green' },
];

export const marketData = [
  { id: 1, crop: 'Wheat', cropHi: 'गेहूं', price: 2420, unit: 'quintal', trend: 'up', change: 3.2, suggestion: 'sell', emoji: '🌾' },
  { id: 2, crop: 'Tomato', cropHi: 'टमाटर', price: 1860, unit: 'quintal', trend: 'down', change: 5.1, suggestion: 'hold', emoji: '🍅' },
  { id: 3, crop: 'Onion', cropHi: 'प्याज', price: 3120, unit: 'quintal', trend: 'up', change: 8.4, suggestion: 'sell', emoji: '🧅' },
  { id: 4, crop: 'Soybean', cropHi: 'सोयाबीन', price: 4480, unit: 'quintal', trend: 'flat', change: 0.3, suggestion: 'hold', emoji: '🫘' },
];

export const nearbyMandi = { name: 'Sanwer Mandi', distance: '8 km', open: true };

export const schemes = [
  { id: 1, name: 'PM Kisan Samman', nameHi: 'पीएम किसान सम्मान', desc: '₹2000 installment due', descHi: '₹2000 किस्त देय', tag: 'Apply now', tone: 'accent' },
  { id: 2, name: 'Crop Insurance', nameHi: 'फसल बीमा', desc: 'Last date: 15 Aug', descHi: 'अंतिम तिथि: 15 अगस्त', tag: 'Urgent', tone: 'warning' },
];

export const notifications = [
  { id: 1, cat: 'urgent', title: 'Pest outbreak nearby', titleHi: 'आसपास कीट प्रकोप', body: 'Fall armyworm reported in Sanwer.', time: '2h', icon: 'alert-triangle' },
  { id: 2, cat: 'weather', title: 'Heavy rain alert', titleHi: 'भारी बारिश अलर्ट', body: 'Rain in 3 hours. Secure harvest.', time: '3h', icon: 'cloud-rain' },
  { id: 3, cat: 'market', title: 'Onion price up 8%', titleHi: 'प्याज भाव 8% ऊपर', body: 'Good time to sell at Sanwer.', time: '5h', icon: 'trending-up' },
  { id: 4, cat: 'crop', title: 'Tomato leaf curl', titleHi: 'टमाटर पत्ती कर्ल', body: 'Disease risk high. Spray advised.', time: '6h', icon: 'leaf' },
  { id: 5, cat: 'government', title: 'PM Kisan installment', titleHi: 'पीएम किसान किस्त', body: '₹2000 due. Check status.', time: '1d', icon: 'landmark' },
  { id: 6, cat: 'help', title: 'Krishi helpline updated', titleHi: 'कृषि हेल्पलाइन', body: 'New toll-free number active.', time: '2d', icon: 'phone' },
];

export const quickSuggestions = [
  'When to spray tomato?',
  'Is wheat ready to harvest?',
  'Onion mandi rate today',
  'Pest on leaves — what to do?',
];

export const aiThread = [
  {
    role: 'ai',
    problem: 'Tomato leaf curl detected',
    problemHi: 'टमाटर पत्ती कर्ल पाया',
    reason: 'Whitefly infestation + high humidity',
    reasonHi: 'व्हाइटफ्लाई + उच्च आर्द्रता',
    action: 'Spray neem oil today, Imidacloprid tomorrow',
    actionHi: 'आज नीम का तेल, कल इमिडाक्लोप्रिड',
    confidence: 88,
    scheme: 'PM-AASHA scheme covers treatment cost',
    schemeHi: 'पीएम-आशा योजना उपचार लागत देती है',
  },
];

export const verifiedAdvisories = [
  { id: 1, src: 'Krishi Vigyan Kendra', title: 'Delayed sowing for soybean this week', titleHi: 'इस सप्ताह सोयाबीन देर से बुवाई', body: 'Heavy rain forecast for Mon-Tue. Move soybean sowing to Wed or later for better germination.', bodyHi: 'सोम-मंगल के लिए भारी बारिश का अनुमान। सोयाबीन की बुवाई बेहतर अंकुरण के लिए बुधवार या बाद तक टालें।', verified: true, time: '5h' },
  { id: 2, src: 'ICAR', title: 'Use yellow sticky traps for whitefly', titleHi: 'व्हाइटफ्लाई के लिए पीला चिपकने वाला जाल', body: 'Place 4 traps per acre at canopy height. Check and replace weekly.', bodyHi: 'प्रति एकड़ 4 जाल छत्र ऊंचाई पर लगाएं। साप्ताहिक जांचें और बदलें।', verified: true, time: '1d' },
  { id: 3, src: 'State Agriculture Dept', title: 'Canal water release on 5 Aug', titleHi: '5 अगस्त को नहर जल रिहाई', body: 'Water will be released in the main canal on 5 Aug. Farmers can irrigate fields adjacent to the canal.', bodyHi: '5 अगस्त को मुख्य नहर में पानी छोड़ा जाएगा। नहर से सटे खेतों को सिंचाई की जा सकती है।', verified: true, time: '2d' },
];

export const villageStats = {
  households: 420, farmers: 1180, waterLevel: 'Good', activeAlerts: 2, cropCover: '74%',
};

export const reports = [
  { id: 1, title: 'Weekly crop health', titleHi: 'साप्ताहिक फसल स्वास्थ्य', date: '28 Jul 2026', type: 'PDF' },
  { id: 2, title: 'Spray log — July', titleHi: 'छिड़काव लॉग — जुलाई', date: '25 Jul 2026', type: 'PDF' },
  { id: 3, title: 'Market earnings Q2', titleHi: 'मंडी कमाई Q2', date: '20 Jul 2026', type: 'CSV' },
];

export const analytics = {
  yield: [{ m: 'Apr', v: 42 }, { m: 'May', v: 55 }, { m: 'Jun', v: 48 }, { m: 'Jul', v: 67 }],
  income: [{ m: 'Apr', v: 38 }, { m: 'May', v: 61 }, { m: 'Jun', v: 52 }, { m: 'Jul', v: 74 }],
  waterUse: [{ m: 'Apr', v: 70 }, { m: 'May', v: 82 }, { m: 'Jun', v: 58 }, { m: 'Jul', v: 45 }],
};

export const offlineFiles = [
  { id: 1, name: 'Crop disease guide (Hindi)', size: '4.2 MB', saved: true },
  { id: 2, name: 'Mandi price list', size: '1.1 MB', saved: true },
  { id: 3, name: 'Spray calendar 2026', size: '2.8 MB', saved: false },
];