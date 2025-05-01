import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider"
import { useTheme } from 'next-themes'
import { ScrollToTop } from '@/components/utils/scroll-to-top';
import { Toaster } from "@/components/ui/toaster"
import './App.css';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Signals from './pages/Signals';
import SignalDetails from './pages/SignalDetails';
import Partners from './pages/Partners';
import Videos from './pages/Videos';
import VideoDetails from './pages/VideoDetails';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';
import DangerousAreaDetails from './pages/DangerousAreaDetails';
import GoodDeeds from './pages/GoodDeeds';
import GoodDeedDetails from './pages/GoodDeedDetails';
import Pets from './pages/Pets';
import PetDetails from './pages/PetDetails';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';

// User Pages
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import MySignals from './pages/MySignals';
import MySignalDetails from './pages/MySignalDetails';
import MyGoodDeeds from './pages/MyGoodDeeds';
import MyGoodDeedDetails from './pages/MyGoodDeedDetails';
import MyPets from './pages/MyPets';
import MyPetDetails from './pages/MyPetDetails';
import Volunteers from './pages/Volunteers';
import VolunteerDetails from './pages/VolunteerDetails';
import MyVolunteers from './pages/MyVolunteers';
import MyVolunteerDetails from './pages/MyVolunteerDetails';
import Witnesses from './pages/Witnesses';
import WitnessDetails from './pages/WitnessDetails';
import MyWitnesses from './pages/MyWitnesses';
import MyWitnessDetails from './pages/MyWitnessDetails';

// Admin Pages
import Admin from './pages/Admin';
import Users from './pages/Users';
import VolunteersManagement from './pages/VolunteersManagement';

// Components
import { AuthProvider } from './components/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { GoodDeedProvider } from './components/GoodDeedProvider';
import { PetProvider } from './components/PetProvider';
import { VolunteerProvider } from './components/VolunteerProvider';
import { WitnessProvider } from './components/WitnessProvider';
import WitnessesPage from './pages/WitnessesManagement';

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
        <AuthProvider>
          <GoodDeedProvider>
            <PetProvider>
              <VolunteerProvider>
                <WitnessProvider>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/signals" element={<Signals />} />
                    <Route path="/signals/:id" element={<SignalDetails />} />
                    <Route path="/partners" element={<Partners />} />
                    <Route path="/videos" element={<Videos />} />
                    <Route path="/videos/:id" element={<VideoDetails />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/dangerous-areas/:id" element={<DangerousAreaDetails />} />
                    <Route path="/good-deeds" element={<GoodDeeds />} />
                    <Route path="/good-deeds/:id" element={<GoodDeedDetails />} />
                    <Route path="/pets" element={<Pets />} />
                    <Route path="/pets/:id" element={<PetDetails />} />
                    <Route path="/volunteers" element={<Volunteers />} />
                    <Route path="/volunteers/:id" element={<VolunteerDetails />} />
                    <Route path="/witnesses" element={<Witnesses />} />
                    <Route path="/witness/:id" element={<WitnessDetails />} />

                    {/* Auth Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    <Route path="/verify-email/:token" element={<VerifyEmail />} />

                    {/* User Routes */}
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/edit-profile"
                      element={
                        <ProtectedRoute>
                          <EditProfile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/my-signals"
                      element={
                        <ProtectedRoute>
                          <MySignals />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/my-signals/:id"
                      element={
                        <ProtectedRoute>
                          <MySignalDetails />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/my-good-deeds"
                      element={
                        <ProtectedRoute>
                          <MyGoodDeeds />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/my-good-deeds/:id"
                      element={
                        <ProtectedRoute>
                          <MyGoodDeedDetails />
                        </ProtectedRoute>
                      }
                    />
                     <Route
                      path="/my-pets"
                      element={
                        <ProtectedRoute>
                          <MyPets />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/my-pets/:id"
                      element={
                        <ProtectedRoute>
                          <MyPetDetails />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/my-volunteers"
                      element={
                        <ProtectedRoute>
                          <MyVolunteers />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/my-volunteers/:id"
                      element={
                        <ProtectedRoute>
                          <MyVolunteerDetails />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/my-witnesses"
                      element={
                        <ProtectedRoute>
                          <MyWitnesses />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/my-witnesses/:id"
                      element={
                        <ProtectedRoute>
                          <MyWitnessDetails />
                        </ProtectedRoute>
                      }
                    />

                    {/* Admin Routes */}
                    <Route
                      path="/admin"
                      element={
                        <AdminRoute>
                          <Admin />
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/admin/users"
                      element={
                        <AdminRoute>
                          <Users />
                        </AdminRoute>
                      }
                    />
                   <Route
                      path="/admin/volunteers"
                      element={
                        <AdminRoute>
                          <VolunteersManagement />
                        </AdminRoute>
                      }
                    />

                    {/* Not Found Route */}
                    <Route path="*" element={<NotFound />} />
                    <Route path="/witnesses-management" element={<WitnessesPage />} />
                  </Routes>
                </WitnessProvider>
              </VolunteerProvider>
            </PetProvider>
          </GoodDeedProvider>
        </AuthProvider>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;
