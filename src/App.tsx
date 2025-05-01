
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

// Import AuthProvider and QueryClient
import { AuthProvider } from './components/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
          <Router>
            <ScrollToTop />
            <div className="App">
              <Routes>
                {/* Home route */}
                <Route path="/" element={<Index />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<Admin />} />
                <Route path="/witnesses-management" element={<WitnessesManagementPage />} />
                <Route path="/moderator" element={<Moderator />} />
                
                {/* Content Routes */}
                <Route path="/videos" element={<Videos />} />
                <Route path="/volunteers" element={<Volunteers />} />
                <Route path="/good-deeds" element={<GoodDeeds />} />
                <Route path="/witnesses" element={<Witnesses />} />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Toaster />
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
