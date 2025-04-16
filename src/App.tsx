
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./components/AuthProvider";
import { GDPRProvider } from "./components/gdpr/GDPRProvider";
import MobileNavBar from "./components/MobileNavBar";
import ScrollToTop from "./components/ScrollToTop";
import ProfilePanel from "./components/profile/ProfilePanel";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import SubmitSignal from "./pages/SubmitSignal";
import Admin from "./pages/Admin";
import Moderator from "./pages/Moderator";
import SignalDetail from "./pages/SignalDetail";
import NotFound from "./pages/NotFound";
import Volunteers from "./pages/Volunteers";
import AdminVolunteers from "./pages/AdminVolunteers";
import Signals from "./pages/Signals";
import SignalDetailPublic from "./pages/SignalDetailPublic";
import Blog from "./pages/Blog";
import BlogPostDetail from "./pages/BlogPostDetail";
import AdminBlog from "./pages/AdminBlog";
import AdminVideos from "./pages/AdminVideos";
import AdminPartners from "./pages/AdminPartners";
import AdminRescuers from "./pages/AdminRescuers";
import Videos from "./pages/Videos";
import Donations from "./pages/Donations";
import Contact from "./pages/Contact";
import Info from "./pages/Info";
import Rescuers from "./pages/Rescuers";
import DangerousAreas from "./pages/DangerousAreas";
import AddDangerousArea from "./pages/AddDangerousArea";
import Witnesses from "./pages/Witnesses";
import SubmitWitness from "./pages/SubmitWitness";
import WitnessDetail from "./pages/WitnessDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <GDPRProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <ProfilePanel />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/submit-signal" element={<SubmitSignal />} />
                <Route path="/volunteers" element={<Volunteers />} />
                <Route path="/rescuers" element={<Rescuers />} />
                <Route path="/dangerous-areas" element={<DangerousAreas />} />
                <Route path="/add-dangerous-area" element={<AddDangerousArea />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/moderator" element={<Moderator />} />
                <Route path="/admin/signals/:id" element={<SignalDetail />} />
                <Route path="/admin/volunteers" element={<AdminVolunteers />} />
                <Route path="/admin/rescuers" element={<AdminRescuers />} />
                <Route path="/admin/blog" element={<AdminBlog />} />
                <Route path="/admin/videos" element={<AdminVideos />} />
                <Route path="/admin/partners" element={<AdminPartners />} />
                <Route path="/signals" element={<Signals />} />
                <Route path="/signal/:id" element={<SignalDetailPublic />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogPostDetail />} />
                <Route path="/videos" element={<Videos />} />
                <Route path="/donations" element={<Donations />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/info" element={<Info />} />
                <Route path="/witnesses" element={<Witnesses />} />
                <Route path="/submit-witness" element={<SubmitWitness />} />
                <Route path="/witness/:id" element={<WitnessDetail />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <MobileNavBar />
            </BrowserRouter>
          </TooltipProvider>
        </GDPRProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
