
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import SignalsList from '@/components/SignalsList';
import PartnerCarousel from '@/components/PartnerCarousel';
import BlogSection from '@/components/BlogSection';
import VideoSection from '@/components/VideoSection';
import PartnerSection from '@/components/PartnerSection';
import WitnessesSection from '@/components/witnesses/WitnessesSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow mt-16">
        <HeroSection />
        <SignalsList />
        <WitnessesSection />
        <PartnerCarousel />
        <VideoSection />
        <BlogSection />
        <PartnerSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
