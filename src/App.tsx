
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import { ThemeProvider } from "./components/ThemeProvider";
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from "@/components/ui/toaster";
import './App.css';

// Page imports
import Admin from './pages/Admin';
import Index from './pages/Index';
import WitnessesManagementPage from './pages/WitnessesManagement';
import NotFound from './pages/NotFound';
import Videos from './pages/Videos';
import Moderator from './pages/Moderator';
import Volunteers from './pages/Volunteers';
import GoodDeeds from './pages/GoodDeeds';
import Witnesses from './pages/Witnesses';
import Signals from './pages/Signals';
import Pets from './pages/Pets';
import Info from './pages/Info';
import SubmitSignal from './pages/SubmitSignal';
import Auth from './pages/Auth';

// Import AuthProvider and QueryClient
import { AuthProvider } from './components/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GDPRProvider } from './components/gdpr/GDPRProvider';

// Create a client
const queryClient = new QueryClient();

function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <GDPRProvider>
            <Router>
              <ScrollToTop />
              <div className="App">
                <Routes>
                  {/* Home route */}
                  <Route path="/" element={<Index />} />
                  
                  {/* Authentication */}
                  <Route path="/auth" element={<Auth />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/witnesses-management" element={<WitnessesManagementPage />} />
                  <Route path="/moderator" element={<Moderator />} />
                  
                  {/* Content Routes */}
                  <Route path="/videos" element={<Videos />} />
                  <Route path="/volunteers" element={<Volunteers />} />
                  <Route path="/good-deeds" element={<GoodDeeds />} />
                  <Route path="/witnesses" element={<Witnesses />} />
                  <Route path="/signals" element={<Signals />} />
                  <Route path="/pets" element={<Pets />} />
                  <Route path="/info" element={<Info />} />
                  <Route path="/submit-signal" element={<SubmitSignal />} />
                  
                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Toaster />
            </Router>
          </GDPRProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
