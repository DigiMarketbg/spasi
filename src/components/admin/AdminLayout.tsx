
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface AdminLayoutProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  isAdmin: boolean;
  title?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, isAuthenticated, isAdmin, title = "Админ панел" }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow mt-16 px-4 py-12">
        <div className="container mx-auto">
          {title && <h1 className="text-3xl font-bold mb-8">{title}</h1>}
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminLayout;
