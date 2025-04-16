
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
import { UserData } from './hooks/types';

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

  // Enhanced filter for users based on search and role filters
  const filteredUsers = users.filter(user => {
    console.log("Filtering user:", user.email, "Role:", user.role, "Is Admin:", user.is_admin);
    
    // Search term filter (name, email)
    const matchesSearch = !searchTerm 
      || (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
      || (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Role filter
    let matchesRole = true;
    if (roleFilter === "admin") {
      matchesRole = !!user.is_admin;
    } else if (roleFilter === "moderator") {
      matchesRole = user.role === "moderator";
    } else if (roleFilter === "user") {
      matchesRole = !user.is_admin && user.role !== "moderator";
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

  console.log("UsersManagement received users:", users.length, users);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление на потребители</CardTitle>
        <CardDescription>
          Преглеждайте и управлявайте всички потребители в системата
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default UsersManagement;
