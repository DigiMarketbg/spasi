
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface AdminDashboardCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  badgeCount?: number;
  onClick?: () => void;
  actionText?: string;
  actionLink?: string;
  gradient?: string;
}

const AdminDashboardCard = ({ 
  title, 
  description,
  icon: Icon,
  badgeCount,
  onClick,
  actionText,
  actionLink,
  gradient
}: AdminDashboardCardProps) => {
  const cardContent = (
    <div 
      className={`glass rounded-xl p-6 transition-all duration-200 hover:shadow-md ${onClick || actionLink ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium flex items-center">
          {title}
          {badgeCount !== undefined && badgeCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
              {badgeCount}
            </span>
          )}
        </h3>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${gradient ? `bg-gradient-to-r ${gradient}` : 'bg-primary/10'}`}>
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      
      {description && (
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      )}
      
      {actionText && actionLink && (
        <Link to={actionLink} className="flex items-center justify-between text-sm mt-2 text-muted-foreground hover:text-foreground transition-colors">
          <span>{actionText}</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );

  if (actionLink) {
    return <Link to={actionLink}>{cardContent}</Link>;
  }

  return cardContent;
};

export default AdminDashboardCard;
