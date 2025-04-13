
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import PartnerCarousel from '@/components/PartnerCarousel';
import SignalsList from '@/components/SignalsList';
import BlogSection from '@/components/BlogSection';
import PartnerSection from '@/components/PartnerSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow mt-16">
        <HeroSection />
        <PartnerCarousel />
        <SignalsList />
        <BlogSection />
        <PartnerSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
