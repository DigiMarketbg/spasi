
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, ShieldCheck } from "lucide-react";
import PrivacyPolicyTab from './tabs/PrivacyPolicyTab';
import CookiesTab from './tabs/CookiesTab';
import { useGDPRConsent } from './hooks/useGDPRConsent';

// Re-export the hook for backward compatibility
export { useGDPRConsent };

interface GDPRConsentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const GDPRConsentDialog: React.FC<GDPRConsentDialogProps> = ({
  isOpen,
  onClose,
  onAccept
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <div>
            <DialogTitle>Политика за поверителност и бисквитки</DialogTitle>
            <DialogDescription>
              Необходимо е да приемете нашите условия, за да продължите да използвате сайта
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="privacy" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="privacy" className="text-[10px] sm:text-xs">Политика поверителност</TabsTrigger>
            <TabsTrigger value="cookies" className="text-[10px] sm:text-xs">Политика бисквитки</TabsTrigger>
          </TabsList>
          
          <TabsContent value="privacy" className="mt-2">
            <PrivacyPolicyTab />
          </TabsContent>
          
          <TabsContent value="cookies" className="mt-2">
            <CookiesTab />
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="pt-4 flex flex-col sm:flex-row gap-2">
          <Button 
            className="w-full px-1.5 py-1 text-[10px] sm:text-xs" 
            onClick={onAccept} 
            variant="default"
          >
            <ShieldCheck className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
            Приемам
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GDPRConsentDialog;
