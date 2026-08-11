import React, { useState, useEffect, useRef } from 'react';
import RecommendationCard from '@/components/ui/RecommendationCard';
import StatusChip from '@/components/ui/StatusChip';
import PageHeader from '@/components/layout/PageHeader';
import VoiceButton from '@/components/layout/VoiceButton';
import KisaanMascot from '@/components/mascot/KisaanMascot';
import { CloudRain, Droplets, Wind, TrendingUp, Landmark, AlertTriangle, RotateCcw, ChevronRight, Sprout } from 'lucide-react';
import { useLang } from '@/lib/languageContext';
import { farmer, schemes } from '@/lib/mockData';
import { useAuth } from '@/lib/AuthContext';
import { api } from '@/lib/api';
import { Link } from 'react-router-dom';
import { animateStaggerEntrance, prefersReducedMotion } from '@/lib/animation';

function greetingKey() {
  const h = new Date().getHours();
  if (h < 12) return 'good_morning';
  if (h < 17) return 'good_afternoon';
  return 'good_evening';
}

export default function Home() {
  const { t, lang } = useLang();
  const isHindi = lang === 'hi';
  const { user } = useAuth();
  const [realCrops, setRealCrops] = useState([]);
  const [realFarms, setRealFarms] = useState([]);
  const mainCrop = realCrops[0] || null;
  const [weather, setWeather] = useState(null);
  const [marketData, setMarketData] = useState([]);
  const [aiRec, setAiRec] = useState(null);
  const schemesRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (schemesRef.current) animateStaggerEntrance(schemesRef.current.children, { delay: 80 });
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [weatherRes, marketRes, farmsRes] = await Promise.allSettled([
          api.getWeather(),
          api.getMarketPrices(),
          api.getFarms(),
        ]);
        if (weatherRes.status === 'fulfilled') setWeather(weatherRes.value);
        if (marketRes.status === 'fulfilled') setMarketData(Array.isArray(marketRes.value) ? marketRes.value : []);
        const farms = farmsRes.status === 'fulfilled' && Array.isArray(farmsRes.value) ? farmsRes.value : [];
        setRealFarms(farms);

        const allCrops = [];
        for (const farm of farms) {
          try {
            const farmCrops = await api.getCrops(farm.id);
            allCrops.push(...farmCrops);
          } catch {
            // ignore per-farm crop fetch errors on the dashboard
          }
        }
        setRealCrops(allCrops);

        // Get AI recommendation
        try {
          const rec = await api.askAI({
            question: 'What should I do for my crops today?',
            language: lang,
          });
          const action = (rec && typeof rec.action === 'string' && rec.action) || rec?.problem || 'Check your crops today';
          setAiRec({
            title: action.split('.')[0],
            titleHi: action.split('.')[0],
            reason: rec?.reason || '',
            reasonHi: rec?.reason || '',
            confidence: rec?.confidence ?? 0,
            action: 'View why',
            tone: 'wait',
          });
        } catch {
          setAiRec(null);
        }
      } catch (e) {
        console.error('Failed to load home data:', e);
      }
    };
    loadData();
  }, [lang]);

  const fallbackTop = { emoji: '🧅', crop: 'Onion', cropHi: 'प्याज', price: 3120, change: 8.4 };
  const topMarket = marketData.find((m) => m && typeof m === 'object' && m.price !== undefined) || marketData[2] || fallbackTop;

  return (
    <div className="relative">
      <div className="flex flex-col gap-4 animate-page-in pb-16">
        <PageHeader
          title={`${t(greetingKey())}, ${user?.username || farmer.name}`}
          subtitle={realFarms.length ? `${realFarms.length} ${isHindi ? 'फार्म' : 'farms'} · ${realCrops.length} ${isHindi ? 'फसलें' : 'crops'}` : (farmer.village ? `${farmer.village} · ${farmer.district}` : '')}
        />

        {/* Emergency alert */}
        <div className="rounded-2xl border-[3px] border-berry bg-berry/10 p-4 flex items-center gap-3 animate-fade-up stagger-1">
          <span className="grid place-items-center h-11 w-11 rounded-xl bg-berry text-white shrink-0 shadow-duo">
            <AlertTriangle className="h-5 w-5" strokeWidth={2.6} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-extrabold text-berry">{isHindi ? 'भारी बारिश चेतावनी' : 'Heavy rain alert'}</p>
            <p className="text-xs text-foreground/70 font-semibold">{isHindi ? '3 घंटे में बारिश — कटाई सुरक्षित करें' : 'Rain in 3 hrs — secure harvest'}</p>
          </div>
          <Link to="/verified-advisories" className="btn-duo btn-berry h-11 px-4">{t('check')}</Link>
        </div>

        {/* Weather hero — big colorful section */}
        <div className="rounded-3xl overflow-hidden border-4 text-white relative animate-fade-up stagger-2"
          style={{ backgroundColor: 'hsl(var(--hero-water))', borderColor: 'hsl(var(--water-edge))' }}>
          <div className="relative px-5 pt-5 pb-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-white/80">{t('weather_today')}</p>
                <p className="text-5xl font-extrabold font-heading mt-1 leading-none drop-shadow-sm">{weather?.temp ?? 31}°</p>
                <p className="text-sm font-bold mt-1 text-white/90">{isHindi ? (weather?.conditionHi ?? 'बारिश संभावित') : (weather?.condition ?? 'Rain expected')}</p>
              </div>
              <div className="w-20 h-20 shrink-0">
                <KisaanMascot mood="watering" className="w-full h-full drop-shadow animate-float-soft" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="bg-white/20 rounded-2xl py-2.5 text-center backdrop-blur-sm border-2 border-white/25">
                <Droplets className="h-4 w-4 text-white mx-auto mb-0.5" />
                <p className="text-[10px] font-bold text-white/75">{isHindi ? 'बारिश' : 'Rain'}</p>
                <p className="text-sm font-extrabold">{weather?.rainChance ?? 78}%</p>
              </div>
              <div className="bg-white/20 rounded-2xl py-2.5 text-center backdrop-blur-sm border-2 border-white/25">
                <CloudRain className="h-4 w-4 text-white mx-auto mb-0.5" />
                <p className="text-[10px] font-bold text-white/75">Humidity</p>
                <p className="text-sm font-extrabold">{weather?.humidity ?? 82}%</p>
              </div>
              <div className="bg-white/20 rounded-2xl py-2.5 text-center backdrop-blur-sm border-2 border-white/25">
                <Wind className="h-4 w-4 text-white mx-auto mb-0.5" />
                <p className="text-[10px] font-bold text-white/75">Wind</p>
                <p className="text-sm font-extrabold">{weather?.wind ?? 12} km</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main AI recommendation */}
        {aiRec && <RecommendationCard rec={aiRec} isHindi={isHindi} />}

        {/* Continue last — compact */}
        <div className="glass rounded-2xl p-3.5 flex items-center gap-3 animate-fade-up stagger-4">
          <span className="grid place-items-center h-11 w-11 rounded-xl bg-accent/12 text-accent shrink-0">
            <RotateCcw className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wide">{t('continue_last')}</p>
            <p className="text-sm font-extrabold truncate">{isHindi ? 'टमाटर छिड़काव जारी रखें' : 'Resume tomato spray plan'}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>

        {/* Crop status */}
        {mainCrop ? (
          <Link to="/crops">
            <div className="glass rounded-2xl p-4 animate-fade-up stagger-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-extrabold text-muted-foreground uppercase tracking-wide">{t('crop_status')}</p>
                <StatusChip tone={mainCrop.status === 'HARVESTED' ? 'green' : mainCrop.status === 'GROWING' ? 'amber' : 'muted'}>{mainCrop.status}</StatusChip>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-4xl drop-shadow-sm">{mainCrop.emoji || '🌱'}</span>
                <div className="flex-1 space-y-2 min-w-0">
                  <p className="font-extrabold truncate">{mainCrop.name} <span className="text-muted-foreground font-bold">· {mainCrop.season}</span></p>
                  <div className="bar-duo">
                    <div style={{ width: `${mainCrop.status === 'HARVESTED' ? 100 : mainCrop.status === 'GROWING' ? 75 : 40}%` }} />
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground font-bold shrink-0">Planted {mainCrop.planted_at}</span>
              </div>
            </div>
          </Link>
        ) : (
          <Link to="/farms">
            <div className="glass rounded-2xl p-4 flex items-center gap-3 animate-fade-up stagger-5 border-[3px] border-primary/20">
              <span className="grid place-items-center h-11 w-11 rounded-xl bg-primary/12 text-primary shrink-0">
                <Sprout className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground font-bold">{t('crop_status')}</p>
                <p className="text-sm font-extrabold truncate">{isHindi ? 'फार्म और फसलें जोड़ें' : 'Add farms and crops to get started'}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-primary" />
            </div>
          </Link>
        )}

        {/* Market tip */}
        <Link to="/market">
          <div className="glass rounded-2xl p-4 flex items-center gap-3 animate-fade-up stagger-6 border-[3px] border-water/20">
            <span className="grid place-items-center h-11 w-11 rounded-xl bg-water/12 text-water shrink-0">
              <TrendingUp className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide">{t('market_tip')}</p>
              <p className="text-sm font-extrabold truncate">{topMarket.emoji} {isHindi ? (topMarket.cropHi || topMarket.crop) : topMarket.crop} ₹{topMarket.price} <span className="text-primary">↑{topMarket.change}%</span></p>
            </div>
            <StatusChip tone="green">{t('sell')}</StatusChip>
          </div>
        </Link>

        {/* Scheme reminders — scroll-reveal stagger */}
        <div className="space-y-3" ref={schemesRef}>
          {schemes.map((s) => (
            <div key={s.id} className="glass rounded-2xl p-4 flex items-center gap-3">
              <span className={`grid place-items-center h-11 w-11 rounded-xl shrink-0 ${s.tone === 'warning' ? 'bg-tangerine/15 text-tangerine' : 'bg-primary/12 text-primary'}`}>
                <Landmark className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide">{t('scheme_reminder')}</p>
                <p className="text-sm font-extrabold truncate">{isHindi ? s.nameHi : s.name}</p>
                <p className="text-xs text-muted-foreground font-semibold truncate">{isHindi ? s.descHi : s.desc}</p>
              </div>
              <span className={`text-xs font-extrabold uppercase tracking-wide px-3.5 py-2 rounded-xl border-2 ${s.tone === 'warning' ? 'text-tangerine border-tangerine/30 bg-tangerine/10' : 'text-primary border-primary/30 bg-primary/10'}`}>
                {isHindi ? 'आवेदन' : s.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
      <VoiceButton />
    </div>
  );
}
