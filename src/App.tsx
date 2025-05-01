
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import { ThemeProvider } from "./components/ThemeProvider";
import { useTheme } from 'next-themes';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from "@/components/ui/toaster";
import './App.css';
import Admin from './pages/Admin';
import WitnessesPage from './pages/WitnessesManagement';
import { useAuth } from './components/AuthProvider';

function App() {
  const [mounted, setMounted] = useState(false)
  const { setTheme } = useTheme()

  useEffect(() => {
    setTheme('light')
    setMounted(true)
  }, [setTheme])

  if (!mounted) {
    return null
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
  );
}

export default App;
