import React, { useState, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import RecommendationCard from '@/components/ui/RecommendationCard';
import StatusChip from '@/components/ui/StatusChip';
import PageHeader from '@/components/layout/PageHeader';
import VoiceButton from '@/components/layout/VoiceButton';
import { Image } from '@/components/ui/image';
import { CloudRain, Droplets, Wind, TrendingUp, Landmark, AlertTriangle, RotateCcw, ChevronRight, Sprout } from 'lucide-react';
import { useLang } from '@/lib/languageContext';
import { farmer, schemes } from '@/lib/mockData';
import { useAuth } from '@/lib/AuthContext';
import { api } from '@/lib/api';
import { Link } from 'react-router-dom';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [weatherData, marketPrices, farms] = await Promise.all([
          api.getWeather(),
          api.getMarketPrices(),
          api.getFarms(),
        ]);
        setWeather(weatherData);
        setMarketData(marketPrices);
        setRealFarms(farms);

        const allCrops = [];
        for (const farm of farms) {
          try {
            const farmCrops = await api.getCrops(farm.id);
            allCrops.push(...farmCrops);
          } catch (e) {
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
          setAiRec({
            title: rec.action.split('.')[0],
            titleHi: rec.action.split('.')[0],
            reason: rec.reason,
            reasonHi: rec.reason,
            confidence: rec.confidence,
            action: 'View why',
            tone: 'wait',
          });
        } catch (e) {
          // AI fallback - use mock
          setAiRec(null);
        }
      } catch (e) {
        console.error('Failed to load home data:', e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [lang]);

  const topMarket = marketData[2] || { emoji: '🧅', crop: 'Onion', cropHi: 'प्याज', price: 3120, change: 8.4 };

  return (
    <div className="relative">
      <div className="flex flex-col gap-4 animate-page-in pb-16">
      <PageHeader title={`${t(greetingKey())}, ${user?.username || farmer.name}`} subtitle={realFarms.length ? `${realFarms.length} ${isHindi ? 'फार्म' : 'farms'} · ${realCrops.length} ${isHindi ? 'फसलें' : 'crops'}` : (farmer.village ? `${farmer.village} · ${farmer.district}` : '')} />

      {/* Emergency alert */}
      <GlassCard className="p-4 flex items-center gap-3 border-destructive/30 animate-fade-up">
        <span className="grid place-items-center h-10 w-10 rounded-2xl bg-destructive/15 text-destructive shrink-0">
          <AlertTriangle className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">{isHindi ? 'भारी बारिश चेतावनी' : 'Heavy rain alert'}</p>
          <p className="text-xs text-muted-foreground">{isHindi ? '3 घंटे में बारिश — कटाई सुरक्षित करें' : 'Rain in 3 hrs — secure harvest'}</p>
        </div>
        <button className="text-xs font-bold text-destructive px-3.5 py-2 rounded-xl bg-destructive/10 active:scale-95 transition-transform">{t('check')}</button>
      </GlassCard>

      {/* Weather hero with image */}
      <GlassCard className="overflow-hidden animate-fade-up" strong>
        <div className="relative h-28">
          <Image
            src="https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&q=80"
            alt=""
            fittingType="fill"
            className="absolute inset-0 h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div>
              <p className="text-[11px] font-semibold text-white/80">{t('weather_today')}</p>
              <p className="text-2xl font-bold font-heading text-white">{weather?.temp ?? 31}° <span className="text-sm font-medium">{isHindi ? (weather?.conditionHi ?? 'बारिश संभावित') : (weather?.condition ?? 'Rain expected')}</span></p>
            </div>
            <span className="grid place-items-center h-12 w-12 rounded-2xl glass text-white animate-float-soft">
              <CloudRain className="h-6 w-6" />
            </span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 p-4">
          <div className="text-center rounded-2xl bg-muted/50 py-2.5">
            <Droplets className="h-3.5 w-3.5 text-primary mx-auto mb-0.5" />
            <p className="text-[10px] text-muted-foreground">{t('weather')}</p>
            <p className="text-sm font-bold">{weather?.rainChance ?? 78}%</p>
          </div>
          <div className="text-center rounded-2xl bg-muted/50 py-2.5">
            <CloudRain className="h-3.5 w-3.5 text-primary mx-auto mb-0.5" />
            <p className="text-[10px] text-muted-foreground">Humidity</p>
            <p className="text-sm font-bold">{weather?.humidity ?? 82}%</p>
          </div>
          <div className="text-center rounded-2xl bg-muted/50 py-2.5">
            <Wind className="h-3.5 w-3.5 text-primary mx-auto mb-0.5" />
            <p className="text-[10px] text-muted-foreground">Wind</p>
            <p className="text-sm font-bold">{weather?.wind ?? 12} km</p>
          </div>
        </div>
      </GlassCard>

      {/* Main AI recommendation */}
      {aiRec && <RecommendationCard rec={aiRec} isHindi={isHindi} />}

      {/* Continue last — compact */}
      <GlassCard className="p-3.5 flex items-center gap-3 animate-fade-up">
        <span className="grid place-items-center h-9 w-9 rounded-2xl bg-accent/20 text-accent-foreground shrink-0">
          <RotateCcw className="h-4 w-4" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-muted-foreground">{t('continue_last')}</p>
          <p className="text-sm font-semibold truncate">{isHindi ? 'टमाटर छिड़काव जारी रखें' : 'Resume tomato spray plan'}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </GlassCard>

      {/* Crop status */}
      {mainCrop ? (
        <Link to="/crops">
          <GlassCard className="p-4 animate-fade-up">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-muted-foreground">{t('crop_status')}</p>
              <StatusChip tone={mainCrop.status === 'HARVESTED' ? 'green' : mainCrop.status === 'GROWING' ? 'amber' : 'muted'}>{mainCrop.status}</StatusChip>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-3xl">🌱</span>
              <div className="flex-1 space-y-2">
                <p className="font-bold">{mainCrop.name} <span className="text-muted-foreground font-medium">· {mainCrop.season}</span></p>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${mainCrop.status === 'HARVESTED' ? 100 : mainCrop.status === 'GROWING' ? 75 : 40}%` }} />
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground self-end pb-0.5">Planted {mainCrop.planted_at}</span>
            </div>
          </GlassCard>
        </Link>
      ) : (
        <Link to="/farms">
          <GlassCard className="p-4 flex items-center gap-3 animate-fade-up">
            <span className="grid place-items-center h-10 w-10 rounded-2xl bg-primary/12 text-primary shrink-0">
              <Sprout className="h-5 w-5" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">{t('crop_status')}</p>
              <p className="text-sm font-bold truncate">{isHindi ? 'फार्म और फसलें जोड़ें' : 'Add farms and crops to get started'}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </GlassCard>
        </Link>
      )}

      {/* Market tip */}
      <Link to="/market">
        <GlassCard className="p-4 flex items-center gap-3 animate-fade-up">
          <span className="grid place-items-center h-10 w-10 rounded-2xl bg-primary/12 text-primary shrink-0">
            <TrendingUp className="h-5 w-5" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">{t('market_tip')}</p>
            <p className="text-sm font-bold truncate">{topMarket.emoji} {isHindi ? topMarket.cropHi : topMarket.crop} ₹{topMarket.price} <span className="text-primary">↑{topMarket.change}%</span></p>
          </div>
          <StatusChip tone="green">{t('sell')}</StatusChip>
        </GlassCard>
      </Link>

      {/* Scheme reminders */}
      {schemes.map((s) => (
        <GlassCard key={s.id} className="p-4 flex items-center gap-3 animate-fade-up">
          <span className="grid place-items-center h-10 w-10 rounded-2xl bg-warning/15 text-warning shrink-0">
            <Landmark className="h-5 w-5" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">{t('scheme_reminder')}</p>
            <p className="text-sm font-bold truncate">{isHindi ? s.nameHi : s.name}</p>
            <p className="text-xs text-muted-foreground truncate">{isHindi ? s.descHi : s.desc}</p>
          </div>
          <button className={`text-xs font-bold px-3.5 py-2 rounded-xl active:scale-95 transition-transform ${s.tone === 'warning' ? 'bg-warning/15 text-warning' : 'bg-accent/20 text-accent-foreground'}`}>{isHindi ? 'आवेदन' : s.tag}</button>
        </GlassCard>
      ))}

      </div>
      <VoiceButton />
    </div>
  );
}