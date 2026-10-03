import { MessageCircle, Phone, Info, Moon, Sun, Globe } from 'lucide-react';
import { useI18n, LANGS, type Lang } from '@/context/I18nContext';
import { useTheme } from '@/context/ThemeContext';
import { useState, useRef, useEffect } from 'react';

const SUPPORT_PHONE = '966554363516';

export function SupportAbout() {
  const { t, lang, setLang } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="space-y-4">
      {/* Dark/Light Mode Toggle */}
      <div className="card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
            {theme === 'light' ? <Moon size={20} className="text-slate-600" /> : <Sun size={20} className="text-amber-400" />}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{t('dark_mode')}</p>
            <p className="text-xs text-slate-400">{theme === 'dark' ? t('dark_mode') : t('light_mode')}</p>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          role="switch"
          aria-checked={theme === 'dark'}
          className={`relative w-12 h-7 rounded-full transition-colors ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}
        >
          <span
            className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${theme === 'dark' ? 'left-1' : 'left-6'}`}
          />
        </button>
      </div>

      {/* Language Switcher */}
      <div className="card p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
            <Globe size={20} className="text-slate-600 dark:text-slate-300" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">اللغة</p>
            <p className="text-xs text-slate-400">{LANGS.find((l) => l.code === lang)?.label}</p>
          </div>
        </div>
        <div ref={langRef} className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {LANGS.find((l) => l.code === lang)?.label}
            <Globe size={16} className="text-slate-400" />
          </button>
          {langOpen && (
            <div className="absolute top-full mt-1 inset-x-0 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-10 animate-slide-down">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code as Lang); setLangOpen(false); }}
                  className={`w-full text-start px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                    lang === l.code ? 'font-bold text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Support & About */}
      <div className="card p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Info size={20} className="text-slate-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{t('support_about')}</h3>
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {t('about_description')}
        </p>

        <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800">
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{t('app_version')}</span>
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">v1.0</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`https://wa.me/${SUPPORT_PHONE}?text=${encodeURIComponent('مرحباً، أحتاج للمساعدة في تطبيق إدارة الشقق')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-success flex-1"
          >
            <MessageCircle size={18} />
            {t('whatsapp_support')}
          </a>
          <a
            href={`tel:+${SUPPORT_PHONE}`}
            className="btn-primary flex-1"
          >
            <Phone size={18} />
            {t('call_support')}
          </a>
        </div>
      </div>
    </div>
  );
}
