
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SignalsList from '@/components/SignalsList';

const Signals = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow mt-16">
        <SignalsList />
      </main>
      
      <Footer />
    </div>
  );
};

export default Signals;
