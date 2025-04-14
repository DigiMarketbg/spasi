
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import ParticleBackground from './ParticleBackground';
import { useNavigate } from 'react-router-dom';
import { getPartners } from '@/lib/api';
import { Partner } from '@/types/partner';

const PartnerSection = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await getPartners();
        setPartners(data);
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  return (
    <section className="relative py-24 px-4 md:px-6 lg:px-8 overflow-hidden">
      <ParticleBackground count={30} className="opacity-50" />
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Стани партньор</h2>
          
          <p className="text-lg text-muted-foreground mb-8">
            Поддържаме платформата с дарения и партньорска помощ. Всяко дарение помага да продължим
            да поддържаме и развиваме платформата.
          </p>
          
          {/* Partner Logos Section */}
          {loading ? (
            <div className="text-center mb-8">
              <div className="animate-pulse">Зареждане...</div>
            </div>
          ) : partners.length > 0 ? (
            <div className="flex justify-center flex-wrap gap-4 mb-8">
              {partners.map(partner => (
                <div key={partner.id} className="bg-black/50 p-4 rounded-lg inline-block">
                  {partner.website_url ? (
                    <a href={partner.website_url} target="_blank" rel="noopener noreferrer">
                      <img 
                        src={partner.logo_url} 
                        alt={partner.company_name} 
                        className="h-16 w-auto object-contain" 
                      />
                    </a>
                  ) : (
                    <img 
                      src={partner.logo_url} 
                      alt={partner.company_name} 
                      className="h-16 w-auto object-contain" 
                    />
                  )}
                </div>
              ))}
            </div>
          ) : null}
          
          <div className="flex justify-center">
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white py-6 px-8 rounded-lg text-base font-medium flex items-center gap-2"
              onClick={() => navigate('/donations')}
            >
              <Heart className="h-5 w-5" />
              <span>Направи дарение</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerSection;
