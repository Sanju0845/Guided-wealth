import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { UserManagement } from '../components/UserManagement';
import { DataRepository } from '../components/DataRepository';
import { ShieldCheck, BarChart3, Settings, FileText } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('user-management');

  const renderActiveContent = () => {
    switch (activeTab) {
      case 'user-management':
        return <UserManagement />;

      case 'repository':
        return <DataRepository />;

      case 'dashboard':
        return (
          <div className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center space-y-4">
            <h2 className="text-xl font-bold text-slate-900">System Dashboard Overview</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Welcome to the main admin console. Click on <strong className="text-blue-600">User Management</strong> in the left sidebar to manage users.
            </p>
            <button
              onClick={() => setActiveTab('user-management')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs"
            >
              Go to User Management
            </button>
          </div>
        );

      case 'roles':
        return (
          <div className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">Roles & Access Matrix</h2>
            </div>
            <p className="text-xs text-slate-500">
              Configure RBAC permissions, role definitions, and access rules.
            </p>
          </div>
        );

      case 'analytics':
        return (
          <div className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">System Analytics</h2>
            </div>
            <p className="text-xs text-slate-500">
              Detailed traffic breakdown, active session analytics, and user engagement graphs.
            </p>
          </div>
        );

      case 'audit-logs':
        return (
          <div className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">Audit & Security Logs</h2>
            </div>
            <p className="text-xs text-slate-500">
              Immutable system audit trail tracking logins, role changes, and API calls.
            </p>
          </div>
        );

      case 'settings':
        return (
          <div className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">System Settings</h2>
            </div>
            <p className="text-xs text-slate-500">
              Configure API keys, webhooks, authentication providers, and SMTP settings.
            </p>
          </div>
        );

      default:
        return <UserManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Left Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="p-8 flex-1 overflow-y-auto">
          {renderActiveContent()}
        </main>
      </div>
    </div>
  );
};
