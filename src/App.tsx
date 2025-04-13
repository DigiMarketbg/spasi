import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./components/AuthProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import SubmitSignal from "./pages/SubmitSignal";
import Admin from "./pages/Admin";
import SignalDetail from "./pages/SignalDetail";
import NotFound from "./pages/NotFound";
import Volunteers from "./pages/Volunteers";
import AdminVolunteers from "./pages/AdminVolunteers";
import Signals from "./pages/Signals"; // New import
import SignalDetailPublic from "./pages/SignalDetailPublic";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/submit-signal" element={<SubmitSignal />} />
              <Route path="/volunteers" element={<Volunteers />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/signals/:id" element={<SignalDetail />} />
              <Route path="/admin/volunteers" element={<AdminVolunteers />} />
              <Route path="/signals" element={<Signals />} /> {/* New route */}
              <Route path="/signal/:id" element={<SignalDetailPublic />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
