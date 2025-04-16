
import { Tables } from '@/integrations/supabase/types';

export interface SignalData {
  id: string;
  title: string;
  category: string;
  city: string;
  created_at: string;
  is_approved: boolean;
  is_resolved: boolean;
  user_id: string;
  user_full_name?: string;
  user_email?: string;
  status: string;
}

export interface UserData {
  id: string;
  full_name: string | null;
  email: string | null;
  created_at: string | null;
  is_admin: boolean | null;
  role?: Tables<'profiles'>['role'];
}

export interface PartnerRequestData {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string | null;
  message: string | null;
  logo_url: string | null;
  created_at: string;
  is_approved: boolean;
}

export interface ContactMessageData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  created_at: string;
  is_read: boolean;
}
