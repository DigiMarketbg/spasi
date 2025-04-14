
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Check if we're in development environment
export const isDevelopmentEnvironment = (): boolean => {
  const host = window.location.hostname;
  return host === 'localhost' || 
         host === '127.0.0.1' || 
         host.includes('lovableproject.com');
};

// Save OneSignal subscription to database
export const saveSubscriptionToDatabase = async (
  playerId: string, 
  userId: string | undefined,
  isDevEnvironment: boolean
): Promise<void> => {
  try {
    // In development, we just simulate
    if (isDevEnvironment) {
      console.log('DEV: Simulating saving subscription to database');
      return;
    }
    
    if (!playerId) {
      console.error('No OneSignal player ID found');
      return;
    }
    
    // Save subscription to Supabase
    const { error } = await supabase.from('push_subscribers').upsert(
      {
        player_id: playerId,
        user_id: userId || null,
        // Default to empty for now, can be updated later
        city: null,
        category: null,
      },
      { onConflict: 'player_id' }
    );
    
    if (error) {
      console.error('Error saving subscription to database:', error);
      toast({
        title: 'Грешка',
        description: 'Не успяхме да запазим вашия абонамент',
        variant: 'destructive',
      });
    } else {
      console.log('Subscription saved to database successfully');
    }
  } catch (error) {
    console.error('Error in saveSubscriptionToDatabase:', error);
  }
};
