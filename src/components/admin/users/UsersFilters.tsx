
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UsersFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  itemsPerPage: number;
  setItemsPerPage: (value: number) => void;
  totalItems: number;
  currentPage: number;
  indexOfFirstItem: number;
  indexOfLastItem: number;
}

const UsersFilters: React.FC<UsersFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  itemsPerPage,
  setItemsPerPage,
  totalItems,
  indexOfFirstItem,
  indexOfLastItem,
}) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Търси по име или имейл..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-[200px]">
          <Select 
            value={roleFilter} 
            onValueChange={setRoleFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Роля" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Всички</SelectItem>
              <SelectItem value="admin">Администратори</SelectItem>
              <SelectItem value="user">Потребители</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Показване на {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} от {totalItems} потребители
        </p>
        
        <Select 
          value={itemsPerPage.toString()} 
          onValueChange={(value) => setItemsPerPage(parseInt(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Брой на страница" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 на страница</SelectItem>
            <SelectItem value="10">10 на страница</SelectItem>
            <SelectItem value="25">25 на страница</SelectItem>
            <SelectItem value="50">50 на страница</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default UsersFilters;
