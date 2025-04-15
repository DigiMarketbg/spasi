
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const DangerousAreasLoading = () => {
  return (
    <div className="space-y-8">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden border-none bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 shadow-lg">
          <div className="h-2 w-full bg-gray-300" />
          
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <Skeleton className="w-28 h-5" />
              </div>
              
              <div className="flex justify-between items-start">
                <div>
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              
              <div className="bg-background/80 rounded-lg p-4 shadow-inner">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-24" />
                </div>
                
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DangerousAreasLoading;
