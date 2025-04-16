
import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import ErrorAlert from '@/components/signal-form/ErrorAlert';
import { Toaster } from '@/components/ui/sonner';

interface ModeratorLayoutProps {
  children: ReactNode;
  error: string | null;
  onRefresh: () => void;
  isAuthenticated: boolean;
  isModerator: boolean;
}

const ModeratorLayout = ({ 
  children, 
  error, 
  onRefresh, 
  isAuthenticated, 
  isModerator 
}: ModeratorLayoutProps) => {
  const navigate = useNavigate();

  // If not logged in or not a moderator
  if (!isAuthenticated || !isModerator) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Достъпът отказан</h1>
            <p className="mb-6">Трябва да сте модератор, за да видите тази страница.</p>
            <Button onClick={() => navigate('/')}>Към началната страница</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Toaster />
      
      <main className="flex-grow mt-16 px-4 py-12">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8">Модераторски панел</h1>
          
          {error && (
            <div className="mb-6">
              <ErrorAlert error={error} />
              <Button onClick={onRefresh} variant="outline" className="mt-2">
                Опитай отново
              </Button>
            </div>
          )}
          
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ModeratorLayout;
