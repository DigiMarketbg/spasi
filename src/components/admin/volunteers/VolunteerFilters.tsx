
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BULGARIAN_CITIES } from '@/types/volunteer';

interface VolunteerFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  cityFilter: string;
  setCityFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  setCurrentPage: (page: number) => void;
}

const VolunteerFilters: React.FC<VolunteerFiltersProps> = ({
  search,
  setSearch,
  cityFilter,
  setCityFilter,
  statusFilter,
  setStatusFilter,
  setCurrentPage,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="md:w-1/3">
        <Input
          placeholder="Търсене по име или имейл..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full"
        />
      </div>
      
      <div className="md:w-1/4">
        <Select
          value={cityFilter}
          onValueChange={(value) => {
            setCityFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Филтър по град" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Всички градове</SelectItem>
            {BULGARIAN_CITIES.map(city => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="md:w-1/4">
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Филтър по статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Всички</SelectItem>
            <SelectItem value="approved">Одобрени</SelectItem>
            <SelectItem value="pending">Чакащи</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        variant="outline" 
        onClick={() => {
          setSearch('');
          setCityFilter('');
          setStatusFilter('');
          setCurrentPage(1);
        }}
        className="md:w-auto"
      >
        Изчисти филтрите
      </Button>
    </div>
  );
};

export default VolunteerFilters;
