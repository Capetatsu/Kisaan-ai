import React, { useEffect, useState } from 'react';
import { WifiOff, CheckCircle2 } from 'lucide-react';
import { useLang } from '@/lib/languageContext';

export default function OfflineIndicator() {
  const { t } = useLang();
  const [online, setOnline] = useState(() => typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-card border-2 border-border px-3 py-1.5 text-xs font-extrabold">
      {online ? (
        <>
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span className="text-foreground">{t('online')}</span>
          <span className="text-muted-foreground">· {t('last_synced')} 2m</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3.5 w-3.5 text-tangerine" strokeWidth={2.5} />
          <span className="text-tangerine">{t('offline')}</span>
          <CheckCircle2 className="h-3.5 w-3.5 text-primary ml-1" strokeWidth={2.5} />
          <span className="text-muted-foreground hidden sm:inline">{t('cached_advice')}</span>
        </>
      )}
    </div>
  );
}