import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import UsersList from './users/UsersList';
import UsersFilters from './users/UsersFilters';
import UsersEmptyState from './users/UsersEmptyState';
import SignalsPagination from './signals/SignalsPagination';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserData {
  id: string;
  full_name: string | null;
  email: string | null;
  created_at: string | null;
  is_admin: boolean | null;
  role: "user" | "moderator" | "admin" | null;
  phone_number: string | null; // Add phone number to the interface
}

interface UsersManagementProps {
  users: UserData[];
  loadingUsers: boolean;
  onRefresh: () => void;
}

const UsersManagement = ({ users, loadingUsers, onRefresh }: UsersManagementProps) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Неизвестно';
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  // Filter users based on search and role filters
  const filteredUsers = users.filter(user => {
    // Search term filter (name, email)
    const matchesSearch = !searchTerm 
      || (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
      || (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Role filter
    let matchesRole = true;
    if (roleFilter === "admin") {
      matchesRole = Boolean(user.is_admin);
    } else if (roleFilter === "moderator") {
      matchesRole = user.role === 'moderator';
    } else if (roleFilter === "user") {
      matchesRole = !user.is_admin && user.role === 'user';
    }
    
    return matchesSearch && matchesRole;
  });

  // Get current users for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter]);

  return (
    <div>
      {/* Filters */}
      <UsersFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        totalItems={filteredUsers.length}
        currentPage={currentPage}
        indexOfFirstItem={indexOfFirstItem}
        indexOfLastItem={indexOfLastItem}
      />

      {loadingUsers ? (
        <UsersEmptyState loading={true} />
      ) : filteredUsers.length === 0 ? (
        <UsersEmptyState loading={false} />
      ) : (
        <div className="overflow-x-auto">
          <UsersList 
            users={currentUsers}
            onRefresh={onRefresh}
            formatDate={formatDate}
          />
          
          {/* Pagination */}
          {totalPages > 1 && (
            <SignalsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={paginate}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
