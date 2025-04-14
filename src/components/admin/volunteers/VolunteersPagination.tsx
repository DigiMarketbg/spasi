
import React from 'react';
import { Button } from '@/components/ui/button';

interface VolunteersPaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const VolunteersPagination: React.FC<VolunteersPaginationProps> = ({
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-4">
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        >
          Предишна
        </Button>
        
        <div className="flex items-center space-x-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => {
              // Show current page and 1 page before and after
              return page === 1 || 
                     page === totalPages || 
                     Math.abs(page - currentPage) <= 1 ||
                     (page === 2 && currentPage === 1) ||
                     (page === totalPages - 1 && currentPage === totalPages);
            })
            .map((page, index, array) => (
              <React.Fragment key={page}>
                {index > 0 && array[index - 1] !== page - 1 && (
                  <span className="px-2">...</span>
                )}
                <Button
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              </React.Fragment>
            ))}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        >
          Следваща
        </Button>
      </div>
    </div>
  );
};

export default VolunteersPagination;
