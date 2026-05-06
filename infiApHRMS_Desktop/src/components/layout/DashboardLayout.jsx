import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-50 w-full overflow-x-hidden">
      {/* Fixed Sidebar */}
      <Sidebar />
      
      {/* Right Column (Navbar + Content) */}
      <div className="flex-1 flex flex-col min-w-0 ml-80">
        <Navbar />
        <main className="p-8 w-full">
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
