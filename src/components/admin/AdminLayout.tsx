
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  backLink?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, backLink }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow mt-16 px-4 py-12">
        <div className="container mx-auto">
          {backLink && (
            <Link to={backLink} className="flex items-center mb-4 text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Назад
            </Link>
          )}
          <h1 className="text-3xl font-bold mb-8">{title}</h1>
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminLayout;
