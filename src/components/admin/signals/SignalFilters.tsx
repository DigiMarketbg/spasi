
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Categories array for filtering
const CATEGORIES = [
  "Всички категории",
  "Бедствие",
  "Кръводаряване",
  "Опасност",
  "Кражба",
  "Изгубени",
  "Доброволци",
  "Друго"
];

// Cities array for filtering
const CITIES = [
  "Всички градове",
  "София",
  "Пловдив",
  "Варна",
  "Бургас",
  "Русе",
  "Стара Загора",
  "Плевен",
  "Друг"
];

interface SignalFiltersProps {
  searchTerm: string;
  categoryFilter: string;
  cityFilter: string;
  statusFilter: string;
  itemsPerPage: number;
  setSearchTerm: (value: string) => void;
  setCategoryFilter: (value: string) => void;
  setCityFilter: (value: string) => void;
  setStatusFilter: (value: string) => void;
  setItemsPerPage: (value: number) => void;
  totalItems: number;
  startIndex: number;
  endIndex: number;
}

const SignalFilters: React.FC<SignalFiltersProps> = ({
  searchTerm,
  categoryFilter,
  cityFilter,
  statusFilter,
  itemsPerPage,
  setSearchTerm,
  setCategoryFilter,
  setCityFilter,
  setStatusFilter,
  setItemsPerPage,
  totalItems,
  startIndex,
  endIndex
}) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Търси по заглавие, категория или град..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Select 
            value={categoryFilter} 
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Категория" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={cityFilter} 
            onValueChange={setCityFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Град" />
            </SelectTrigger>
            <SelectContent>
              {CITIES.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={statusFilter} 
            onValueChange={setStatusFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Всички</SelectItem>
              <SelectItem value="approved">Одобрени</SelectItem>
              <SelectItem value="unapproved">Неодобрени</SelectItem>
              <SelectItem value="resolved">Разрешени</SelectItem>
              <SelectItem value="unresolved">Неразрешени</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Показване на {startIndex + 1}-{Math.min(endIndex, totalItems)} от {totalItems} сигнала
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

export default SignalFilters;
