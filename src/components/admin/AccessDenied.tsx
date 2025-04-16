
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const AccessDenied = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Достъпът отказан</h1>
          <p className="mb-6">Трябва да сте администратор, за да видите тази страница.</p>
          <Button onClick={() => navigate('/')}>Към началната страница</Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AccessDenied;
