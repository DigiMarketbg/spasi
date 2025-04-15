
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16 mt-16 md:mt-24">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h1 className="text-3xl font-bold">Свържете се с нас</h1>
          <p className="mt-4 text-muted-foreground">
            Имате въпроси или предложения? Свържете се с нас, ние сме тук, за да помогнем.
          </p>
        </div>
        
        <ContactForm />
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
