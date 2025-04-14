
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./components/AuthProvider";
import { OneSignalProvider } from "./components/notifications/OneSignalProvider";
import NotificationDialog from "./components/notifications/NotificationDialog";
import SubscribeButton from "./components/notifications/SubscribeButton";
import MobileNavBar from "./components/MobileNavBar";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import SubmitSignal from "./pages/SubmitSignal";
import Admin from "./pages/Admin";
import SignalDetail from "./pages/SignalDetail";
import NotFound from "./pages/NotFound";
import Volunteers from "./pages/Volunteers";
import AdminVolunteers from "./pages/AdminVolunteers";
import Signals from "./pages/Signals";
import SignalDetailPublic from "./pages/SignalDetailPublic";
import Blog from "./pages/Blog";
import BlogPostDetail from "./pages/BlogPostDetail";
import AdminBlog from "./pages/AdminBlog";
import Donations from "./pages/Donations";
import Contact from "./pages/Contact";
import Info from "./pages/Info";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <OneSignalProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <NotificationDialog />
              {/* Добавяме SubscribeButton към основния App компонент за тестване */}
              <div className="fixed bottom-4 right-4 z-50">
                <SubscribeButton />
              </div>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/submit-signal" element={<SubmitSignal />} />
                <Route path="/volunteers" element={<Volunteers />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/signals/:id" element={<SignalDetail />} />
                <Route path="/admin/volunteers" element={<AdminVolunteers />} />
                <Route path="/admin/blog" element={<AdminBlog />} />
                <Route path="/signals" element={<Signals />} />
                <Route path="/signal/:id" element={<SignalDetailPublic />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogPostDetail />} />
                <Route path="/donations" element={<Donations />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/info" element={<Info />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <MobileNavBar />
            </BrowserRouter>
          </TooltipProvider>
        </OneSignalProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
