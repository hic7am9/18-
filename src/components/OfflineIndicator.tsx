import { useState, useEffect } from 'react';
import { WifiOff, Wifi, CloudOff, RefreshCw } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function OfflineIndicator() {
  const { isOnline, loading } = useApp();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowBanner(true);
    } else {
      setShowBanner(true);
      const timer = setTimeout(() => {
        if (!loading) setShowBanner(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, loading]);

  if (!showBanner && isOnline) return null;

  return (
    <div
      className={`fixed bottom-24 sm:bottom-6 inset-x-4 lg:inset-x-auto lg:end-6 z-40 transition-all duration-300 ${
        showBanner ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
      }`}
    >
      <div
        className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-lg border max-w-sm lg:w-80 ${
          isOnline
            ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800'
            : 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800'
        }`}
      >
        {isOnline ? (
          loading ? (
            <RefreshCw size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 animate-spin" />
          ) : (
            <Wifi size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          )
        ) : (
          <CloudOff size={18} className="text-amber-600 dark:text-amber-400 shrink-0" />
        )}
        <span
          className={`text-sm font-semibold ${
            isOnline
              ? 'text-emerald-700 dark:text-emerald-300'
              : 'text-amber-700 dark:text-amber-300'
          }`}
        >
          {isOnline
            ? loading ? 'جاري مزامنة البيانات...' : 'متصل بالسحابة — البيانات متزامنة'
            : 'وضع عدم الاتصال — التغييرات ستُحفظ وتُزامن لاحقاً'}
        </span>
      </div>
    </div>
  );
}
