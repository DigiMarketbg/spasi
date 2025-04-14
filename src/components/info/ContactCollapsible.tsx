
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Mail } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';

const ContactCollapsible = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  
  return (
    <Collapsible
      open={isContactOpen}
      onOpenChange={setIsContactOpen}
      className="mb-10 glass p-6 md:p-8 rounded-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Свържете се с нас
        </h2>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="w-9 p-0">
            <ChevronDown 
              className={`h-4 w-4 transition-transform duration-200 ${isContactOpen ? 'transform rotate-180' : ''}`} 
            />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="mt-6">
        <ContactForm />
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ContactCollapsible;
