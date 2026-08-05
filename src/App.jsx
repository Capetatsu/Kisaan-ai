import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import { ThemeProvider } from '@/lib/themeContext';
import { LanguageProvider } from '@/lib/languageContext';
import AppLayout from '@/components/layout/AppLayout';

// Pages
import Home from '@/pages/Home';
import Crops from '@/pages/Crops';
import Farms from '@/pages/Farms';
import FarmDetail from '@/pages/FarmDetail';
import Market from '@/pages/Market';
import AI from '@/pages/AI';
import VillageStatus from '@/pages/VillageStatus';
import VerifiedAdvisories from '@/pages/VerifiedAdvisories';
import Reports from '@/pages/Reports';
import Analytics from '@/pages/Analytics';
import OfflineDownloads from '@/pages/OfflineDownloads';
import Settings from '@/pages/Settings';
import Help from '@/pages/Help';
import About from '@/pages/About';
import Notifications from '@/pages/Notifications';
import Login from '@/pages/Login';
import Register from '@/pages/Register';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isAuthenticated } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/farms" element={<Farms />} />
        <Route path="/farms/:farmId" element={<FarmDetail />} />
        <Route path="/crops" element={<Crops />} />
        <Route path="/market" element={<Market />} />
        <Route path="/ai" element={<AI />} />
        <Route path="/village-status" element={<VillageStatus />} />
        <Route path="/verified-advisories" element={<VerifiedAdvisories />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/offline-downloads" element={<OfflineDownloads />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} />
        <Route path="/about" element={<About />} />
        <Route path="/notifications" element={<Notifications />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <QueryClientProvider client={queryClientInstance}>
            <Router>
              <ScrollToTop />
              <AuthenticatedApp />
            </Router>
            <Toaster />
          </QueryClientProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App