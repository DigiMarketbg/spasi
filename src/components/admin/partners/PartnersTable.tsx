
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Partner } from '@/types/partner';
import { PartnerActions } from './PartnerActions';
import { ExternalLink } from 'lucide-react';

interface PartnersTableProps {
  partners: Partner[];
  onDelete: (id: string) => void;
  onEdit: (partner: Partner) => void;
}

const PartnersTable = ({ partners, onDelete, onEdit }: PartnersTableProps) => {
  if (partners.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Няма добавени партньори</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Лого</TableHead>
          <TableHead>Име на компанията</TableHead>
          <TableHead>Уебсайт</TableHead>
          <TableHead>Дата на добавяне</TableHead>
          <TableHead className="text-right">Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {partners.map((partner) => (
          <TableRow key={partner.id}>
            <TableCell>
              <div className="bg-black/50 p-2 rounded-lg inline-block">
                <img 
                  src={partner.logo_url} 
                  alt={partner.company_name} 
                  className="h-10 w-auto object-contain" 
                />
              </div>
            </TableCell>
            <TableCell>{partner.company_name}</TableCell>
            <TableCell>
              {partner.website_url ? (
                <a 
                  href={partner.website_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-500 hover:underline"
                >
                  <span className="truncate max-w-[200px]">{partner.website_url}</span>
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </TableCell>
            <TableCell>{new Date(partner.created_at).toLocaleDateString('bg-BG')}</TableCell>
            <TableCell className="text-right">
              <PartnerActions partner={partner} onDelete={onDelete} onEdit={onEdit} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PartnersTable;
