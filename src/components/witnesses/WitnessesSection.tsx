import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight, Eye, Calendar, MapPin } from 'lucide-react';
import { fetchApprovedWitnesses } from '@/lib/api/witnesses';
import { formatDistanceToNow } from 'date-fns';
import { bg } from 'date-fns/locale';
const WitnessesSection = () => {
  const navigate = useNavigate();
  const {
    data: witnesses = [],
    isLoading
  } = useQuery({
    queryKey: ['homepage-witnesses'],
    queryFn: fetchApprovedWitnesses,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // Get only the latest 3 witnesses
  const recentWitnesses = witnesses.slice(0, 3);
  return;
};
export default WitnessesSection;