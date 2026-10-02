import React from 'react';
import {
  Users,
  LayoutDashboard,
  ShieldCheck,
  Settings,
  BarChart3,
  FileText,
  LogOut,
  ChevronRight,
  Hexagon,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { logout } = useAuth();

  const navigationItems = [
    // { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, badge: null },
    { id: 'user-management', label: 'User Management', icon: Users, badge: 'Active' },
    { id: 'repository', label: 'Data Repository', icon: BarChart3, badge: null },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-200/80 flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white shrink-0">
            <Hexagon className="w-8 h-8 fill-white/20 text-white absolute" />
            <span className="relative z-10 font-black text-xs tracking-tight">GW</span>
          </div>
          <div>
            <h1 className="font-extrabold text-base text-slate-900 tracking-tight leading-none">
              GuidedWealthy
            </h1>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Admin Console</p>
          </div>
        </div>


        <div className="px-4 py-6">

          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-200 group ${isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'}`} />
                    <span>{item.label}</span>
                  </div>

                </button>
              );
            })}
          </nav>
        </div>
      </div>



    </aside>
  );
};
