
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
import Admin from './pages/Admin';
import WitnessesPage from './pages/WitnessesManagement';
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
                {/* Admin Routes */}
                <Route path="/admin" element={<Admin />} />
                <Route path="/witnesses-management" element={<WitnessesPage />} />
                
                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/admin" replace />} />
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
