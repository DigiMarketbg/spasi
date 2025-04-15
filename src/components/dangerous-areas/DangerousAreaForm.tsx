
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { dangerousAreaSchema, DangerousAreaFormValues } from '@/types/dangerous-area';
import { Form } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { useDangerousAreaSubmit } from './hooks/useDangerousAreaSubmit';

// Import form field components
import LocationField from './form-fields/LocationField';
import RegionField from './form-fields/RegionField';
import SeverityField from './form-fields/SeverityField';
import DescriptionField from './form-fields/DescriptionField';
import MapLinkField from './form-fields/MapLinkField';
import ReporterNameField from './form-fields/ReporterNameField';
import SubmitButton from './form-fields/SubmitButton';
import DisclaimerNote from './form-fields/DisclaimerNote';

interface DangerousAreaFormProps {
  onSubmitSuccess?: () => void;
}

const DangerousAreaForm: React.FC<DangerousAreaFormProps> = ({ onSubmitSuccess }) => {
  const form = useForm<DangerousAreaFormValues>({
    resolver: zodResolver(dangerousAreaSchema),
    defaultValues: {
      location: '',
      region: '',
      description: '',
      severity: 'medium',
      map_link: '',
      reported_by_name: '',
    },
  });
  
  const { isSubmitting, handleSubmit } = useDangerousAreaSubmit({ onSubmitSuccess });
  
  const onSubmit = (data: DangerousAreaFormValues) => {
    handleSubmit(data);
  };
  
  return (
    <Card className="border-none bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 shadow-lg">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LocationField control={form.control} />
              <RegionField control={form.control} />
            </div>
            
            <SeverityField control={form.control} />
            <DescriptionField control={form.control} />
            <MapLinkField control={form.control} />
            <ReporterNameField control={form.control} />
            
            <div className="pt-4 flex flex-col md:flex-row gap-3 justify-between">
              <DisclaimerNote />
              <SubmitButton isSubmitting={isSubmitting} />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DangerousAreaForm;
