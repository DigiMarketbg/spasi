
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, QrCode, BanknotesIcon, PaypalIcon } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';

const Donations = () => {
  const [donationAmount, setDonationAmount] = useState('');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow relative py-24 px-4 md:px-6 lg:px-8 overflow-hidden">
        <ParticleBackground count={30} className="opacity-50" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6 flex items-center justify-center gap-3">
              <Heart className="h-10 w-10 text-red-500" />
              Направи дарение
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8">
              Ако вярваш в мисията на Spasi.bg, помогни ни да продължим. 
              Подкрепата ти е безценна и ще помогне да поддържаме и развиваме платформата.
            </p>
            
            <Tabs defaultValue="online" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="online">Онлайн дарение</TabsTrigger>
                <TabsTrigger value="bank">Банков превод</TabsTrigger>
              </TabsList>
              
              <TabsContent value="online" className="mt-6">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input 
                      type="number" 
                      placeholder="Въведете сума" 
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      className="flex-grow"
                    />
                    <Button variant="secondary">лв</Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600">
                      <PaypalIcon className="h-5 w-5" /> PayPal
                    </Button>
                    <Button className="flex items-center gap-2 bg-green-500 hover:bg-green-600">
                      <BanknotesIcon className="h-5 w-5" /> Stripe
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="bank" className="mt-6">
                <div className="bg-muted/30 p-6 rounded-lg text-center">
                  <h3 className="text-xl font-semibold mb-4">Банкова сметка</h3>
                  <div className="space-y-2">
                    <p><strong>IBAN:</strong> BG00 0000 0000 0000 0000</p>
                    <p><strong>BIC:</strong> UNCRBGSF</p>
                    <p><strong>Банка:</strong> Уникредит Булбанк</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-8 text-sm text-muted-foreground">
              <p>
                * Всяко дарение се разпределя за поддръжката и развитието на платформата Spasi.bg.
                Благодарим ви за подкрепата!
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Donations;
