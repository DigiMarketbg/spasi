
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { Mail, MessageCircle, MapPin, Phone } from 'lucide-react';

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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Телефон</h3>
            <p className="text-muted-foreground">+359 888 123 456</p>
            <p className="text-muted-foreground">Пон-Пет: 9:00 - 18:00</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Имейл</h3>
            <p className="text-muted-foreground">contact@spasi.org</p>
            <p className="text-muted-foreground">info@spasi.org</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Адрес</h3>
            <p className="text-muted-foreground">ул. Име на улица 123</p>
            <p className="text-muted-foreground">София, България</p>
          </div>
        </div>
        
        <ContactForm />
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
