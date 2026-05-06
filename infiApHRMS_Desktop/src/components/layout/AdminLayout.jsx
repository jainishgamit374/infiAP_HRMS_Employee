import React from 'react';
import Sidebar from './Sidebar';
import AdminNavbar from './AdminNavbar';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC] w-full overflow-x-hidden">
      {/* Fixed Sidebar */}
      <Sidebar />
      
      {/* Right Content Area */}
      <div className="flex-1 flex flex-col min-w-0 ml-80">
        <AdminNavbar />
        <main className="p-10 w-full animate-in fade-in duration-500">
          <div className="w-full max-w-[1440px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
