
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactCollapsible from '@/components/info/ContactCollapsible';
import PlatformDescription from '@/components/info/PlatformDescription';
import TermsAccordion from '@/components/info/TermsAccordion';
import AboutUsSection from '@/components/info/AboutUsSection';

const Info = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow mt-20 container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Информация</h1>
          
          <AboutUsSection />
          <ContactCollapsible />
          <PlatformDescription />
          
          <div className="glass p-6 md:p-8 rounded-xl">
            <TermsAccordion />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Info;
