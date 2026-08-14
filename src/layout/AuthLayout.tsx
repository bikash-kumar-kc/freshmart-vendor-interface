import NotificationBell from "@/components/NotificationButton";
import Sidebar from "@/components/reuseableComponents/SideBar";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-amber-50 relative">
      <aside className="fixed left-0 top-0 h-screen w-64">
        <Sidebar />
      </aside>

      <main className="ml-64 min-h-screen">
        <div className="p-6">{children}</div>
      </main>
      <div className="fixed right-5 top-3">
        <NotificationBell />
      </div>
    </div>
  );
};

export default AuthLayout;
