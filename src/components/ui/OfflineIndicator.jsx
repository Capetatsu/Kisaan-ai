import React, { useState } from 'react';
import { Wifi, WifiOff, Cloud, CheckCircle2 } from 'lucide-react';
import { useLang } from '@/lib/languageContext';

export default function OfflineIndicator() {
  const { t } = useLang();
  const [online] = useState(true);
  return (
    <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-semibold">
      {online ? (
        <>
          <Wifi className="h-3.5 w-3.5 text-primary" />
          <span className="text-primary">{t('online')}</span>
          <span className="text-muted-foreground">· {t('last_synced')} 2m</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3.5 w-3.5 text-warning" />
          <span className="text-warning">{t('offline')}</span>
          <CheckCircle2 className="h-3.5 w-3.5 text-primary ml-1" />
          <span className="text-muted-foreground hidden sm:inline">{t('cached_advice')}</span>
        </>
      )}
    </div>
  );
}