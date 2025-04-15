
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface SeverityBadgeProps {
  severity: "low" | "medium" | "high";
}

const SeverityBadge = ({ severity }: SeverityBadgeProps) => {
  const getSeverityColor = (severity: "low" | "medium" | "high") => {
    switch (severity) {
      case 'high':
        return 'bg-red-600'; 
      case 'medium':
        return 'bg-orange-500';
      case 'low':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getSeverityText = (severity: "low" | "medium" | "high") => {
    switch (severity) {
      case 'high':
        return 'Висока';
      case 'medium':
        return 'Средна';
      case 'low':
        return 'Ниска';
      default:
        return 'Неизв.';
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={`${getSeverityColor(severity)} ${severity === 'low' ? 'text-black' : 'text-white'} text-xs font-bold rounded-full shadow-sm px-3 py-1 mb-1`}
    >
      {getSeverityText(severity)} опасност
    </Badge>
  );
};

export default SeverityBadge;
