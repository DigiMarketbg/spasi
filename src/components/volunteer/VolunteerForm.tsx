
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { VolunteerFormData } from '@/types/volunteer';
import { volunteerFormSchema, VolunteerFormValues } from './schema/volunteerFormSchema';
import { PersonalInfoFields, LocationField, HelpOptionsField, MotivationField } from './form-fields/FormFields';
import { useVolunteerSubmit } from './form-handlers/useVolunteerSubmit';
import SubmitButton from './form-components/SubmitButton';

interface VolunteerFormProps {
  onSuccess: () => void;
  existingData?: VolunteerFormData;
}

const VolunteerForm = ({ onSuccess, existingData }: VolunteerFormProps) => {
  const form = useForm<VolunteerFormValues>({
    resolver: zodResolver(volunteerFormSchema),
    defaultValues: existingData || {
      full_name: '',
      email: '',
      phone: '',
      city: '',
      can_help_with: [],
      motivation: '',
    },
  });

  const { handleSubmit, isSubmitting } = useVolunteerSubmit(onSuccess);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <PersonalInfoFields />
        <LocationField />
        <HelpOptionsField />
        <MotivationField />
        <SubmitButton isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
};

export default VolunteerForm;
