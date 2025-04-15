
import React, { useEffect, useState } from 'react';
import { DangerousArea } from '@/types/dangerous-area';
import DangerousAreaCard from './DangerousAreaCard';
import DangerousAreasLoading from './DangerousAreasLoading';
import DangerousAreasEmpty from './DangerousAreasEmpty';

interface DangerousAreasListProps {
  areas: DangerousArea[];
  isLoading: boolean;
  searchQuery: string;
  isAdmin?: boolean;
  onApprove?: (id: string) => Promise<void>;
  onDelete?: (id: string) => void;
  processingApproval?: string | null;
}

const DangerousAreasList = ({ 
  areas, 
  isLoading, 
  searchQuery, 
  isAdmin = false,
  onApprove, 
  onDelete,
  processingApproval
}: DangerousAreasListProps) => {
  const [filteredAreas, setFilteredAreas] = useState<DangerousArea[]>([]);
  
  useEffect(() => {
    if (areas.length > 0) {
      const filtered = areas.filter(area => {
        const locationMatch = area.location.toLowerCase().includes(searchQuery.toLowerCase());
        const descriptionMatch = area.description.toLowerCase().includes(searchQuery.toLowerCase());
        const regionMatch = area.region?.toLowerCase().includes(searchQuery.toLowerCase());
        return locationMatch || descriptionMatch || (regionMatch || false);
      });
      setFilteredAreas(filtered);
    } else {
      setFilteredAreas([]);
    }
  }, [searchQuery, areas]);

  if (isLoading) {
    return <DangerousAreasLoading />;
  }

  if (filteredAreas.length === 0) {
    return <DangerousAreasEmpty totalCount={areas.length} searchActive={searchQuery.length > 0} />;
  }

  return (
    <div className="space-y-8">
      {filteredAreas.map((area) => (
        <DangerousAreaCard 
          key={area.id}
          area={area}
          isAdmin={isAdmin}
          onApprove={onApprove}
          onDelete={onDelete}
          processingApproval={processingApproval}
        />
      ))}
    </div>
  );
};

export default DangerousAreasList;
