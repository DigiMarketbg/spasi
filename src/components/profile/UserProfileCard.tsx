
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UserProfileCardProps {
  email: string | undefined;
  fullName: string | null | undefined;
  phoneNumber?: string | null;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ 
  email, 
  fullName,
  phoneNumber 
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Информация за профила</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p><strong>Имейл:</strong> {email}</p>
          {fullName && <p><strong>Име:</strong> {fullName}</p>}
          {phoneNumber && <p><strong>Телефон:</strong> {phoneNumber}</p>}
        </div>
      </CardContent>
    </Card>
  );
};
