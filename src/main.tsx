
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { supabase } from './integrations/supabase/client'

// Make Supabase available globally for the OneSignal integration
declare global {
  interface Window {
    supabase: typeof supabase;
    OneSignal: any;
    OneSignalDeferred: any[];
  }
}
window.supabase = supabase;

createRoot(document.getElementById("root")!).render(<App />);
