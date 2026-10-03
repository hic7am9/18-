import { I18nProvider } from '@/context/I18nContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AppProvider, useApp } from '@/context/AppContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LockScreen } from '@/components/LockScreen';
import { TopNav } from '@/components/Navigation';
import { Dashboard } from '@/pages/Dashboard';
import { WorkSchedule } from '@/pages/WorkSchedule';
import { CheckOut } from '@/pages/CheckOut';
import { GuestsArchive } from '@/pages/GuestsArchive';
import { InstallPrompt } from '@/components/InstallPrompt';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { Loader2, AlertCircle } from 'lucide-react';

function AppContent() {
  const { view, data, loading, error } = useApp();

  if (loading && data.apartments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Loader2 size={32} className="animate-spin text-slate-400" />
        <p className="text-sm text-slate-400 font-semibold">جاري تحميل البيانات...</p>
      </div>
    );
  }

  if (error && data.apartments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <AlertCircle size={32} className="text-red-400" />
        <p className="text-sm text-red-500 font-semibold">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-primary">إعادة المحاولة</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1 min-w-0 pb-24 sm:pb-0">
        <div className="w-full p-3 sm:p-4">
          {view === 'dashboard' && <Dashboard apartments={data.apartments} locations={data.locations} bookings={data.bookings} />}
          {view === 'schedule' && <WorkSchedule apartments={data.apartments} locations={data.locations} bookings={data.bookings} />}
          {view === 'checkout' && <CheckOut apartments={data.apartments} locations={data.locations} bookings={data.bookings} />}
          {view === 'archive' && <GuestsArchive archive={data.archive} />}
        </div>
      </main>
      <InstallPrompt />
      <OfflineIndicator />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <LockScreen>
        <I18nProvider>
          <ThemeProvider>
            <AppProvider>
              <AppContent />
            </AppProvider>
          </ThemeProvider>
        </I18nProvider>
      </LockScreen>
    </ErrorBoundary>
  );
}

export default App;
