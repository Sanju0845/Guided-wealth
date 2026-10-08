import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  UserCheck,
  ShieldAlert,
  Briefcase,
  Search,
  Filter,
  Trash2,
  Shield,
  RefreshCw,
  Ban,
  CheckCircle2,
  Phone,
  Mail,
  Clock3,
  Check,
  XCircle,
  Eye
} from 'lucide-react';
import { User, UserRole } from '../types/user';
import { UserModal } from './UserModal';

interface ExtendedUser extends User {
  isPending?: boolean;
}

export const UserManagement: React.FC = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ExtendedUser | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${apiUrl}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Stats calculation
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => !u.isBanned && !u.isDeleted && !u.isPending).length;
  const pendingUsers = users.filter((u) => u.isPending && !u.isBanned && !u.isDeleted).length;
  const bannedCount = users.filter((u) => u.isBanned).length;

  // Filter users
  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (user.name && user.name.toLowerCase().includes(query)) ||
      (user.email && user.email.toLowerCase().includes(query)) ||
      user.phone.includes(query);

    const matchesRole = selectedRole === 'ALL' || user.role === selectedRole;
    
    const matchesDate = dateFilter ? user.createdAt.startsWith(dateFilter) : true;

    let matchesStatus = true;
    if (selectedStatus === 'ACTIVE') matchesStatus = !user.isBanned && !user.isDeleted && !user.isPending;
    if (selectedStatus === 'VERIFIED') matchesStatus = !user.isPending && !user.isBanned; // Assuming verified means not pending and not banned
    if (selectedStatus === 'PENDING') matchesStatus = !!user.isPending;
    if (selectedStatus === 'SUSPENDED') matchesStatus = user.isBanned;

    return matchesSearch && matchesRole && matchesStatus && matchesDate;
  });

  const handleDeleteUser = async (_id: string) => {
    if (window.confirm('Are you sure you want to delete this user record?')) {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        await axios.delete(`${apiUrl}/users/${_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers((prev) => prev.filter((u) => u._id !== _id));
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user.');
      }
    }
  };

  const handleViewUser = (user: ExtendedUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (updatedUser: Partial<User>) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      if (updatedUser._id) {
        await axios.put(`${apiUrl}/users/${updatedUser._id}`, updatedUser, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${apiUrl}/users`, updatedUser, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to save user.');
    }
  };

  const handleToggleBan = async (user: ExtendedUser) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const updatedBannedStatus = !user.isBanned;
      await axios.put(`${apiUrl}/users/${user._id}`, 
        { isBanned: updatedBannedStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, isBanned: updatedBannedStatus } : u))
      );
    } catch (error) {
      console.error('Error toggling ban status:', error);
      alert('Failed to update ban status.');
    }
  };

  const handleToggleApprove = async (user: ExtendedUser) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const updatedPendingStatus = !user.isPending;
      await axios.put(`${apiUrl}/users/${user._id}`, 
        { isPending: updatedPendingStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, isPending: updatedPendingStatus } : u))
      );
    } catch (error) {
      console.error('Error toggling approval status:', error);
      alert('Failed to update approval status.');
    }
  };

  const renderRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
            <Shield className="w-3 h-3 text-purple-600" />
            Admin
          </span>
        );
      case 'advisor':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
            <Briefcase className="w-3 h-3 text-blue-600" />
            Advisor
          </span>
        );
      case 'partner':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
            Partner
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
            User
          </span>
        );
    }
  };

  const renderStatusBadge = (user: ExtendedUser) => {
    if (user.isBanned) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <Ban className="w-3.5 h-3.5 text-rose-600" />
          Suspended
        </span>
      );
    }
    if (user.isPending) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <Clock3 className="w-3.5 h-3.5 text-amber-600" />
          Unverified
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        Verified / Active
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            User Management
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Manage user statuses, approve pending registrations, ban/unban users, and handle account deletions.
          </p>
        </div>


      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Users</span>
            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-slate-900">{totalUsers}</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">Registered in system</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Users</span>
            <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-slate-900">{activeUsers}</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">Approved & unbanned</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Approval</span>
            <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock3 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-slate-900">{pendingUsers}</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">Requires admin approval</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Suspended Users</span>
            <div className="w-9 h-9 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-slate-900">{bannedCount}</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">Access blocked</p>
          </div>
        </div>
      </div>

      {/* Toolbar: Search & Filters */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="flex-1 flex gap-2 w-full">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, phone number..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 font-medium"
            />
          </div>
          <div className="relative w-full md:w-48">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-blue-600 font-medium"
              title="Filter by Registration Date"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-semibold focus:outline-none focus:bg-white focus:border-blue-600"
            >
              <option value="ALL">All Roles</option>
              <option value="user">User</option>
              <option value="advisor">Advisor</option>
              <option value="partner">Partner</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-semibold focus:outline-none focus:bg-white focus:border-blue-600"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="VERIFIED">Verified</option>
            <option value="PENDING">Pending</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {/* User Table with Phone Number column and Action buttons (Approve/Pending, Ban/Unban, Delete) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-6">User Profile</th>
                <th className="py-3.5 px-4">Phone Number</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Registered Date</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/80 transition-colors group">
                    {/* User Profile */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar || 'https://ui-avatars.com/api/?name=' + (user.name || 'User') + '&background=random'}
                          alt={user.name || user.phone}
                          className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{user.name || 'Unnamed User'}</p>
                          {user.email && (
                            <p className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400" />
                              {user.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Phone Number Column */}
                    <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{user.countryCode} {user.phone}</span>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">
                      {renderRoleBadge(user.role)}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {renderStatusBadge(user)}
                    </td>

                    {/* Registered Date */}
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Action Buttons: Ban/Unban, Pending/Approve, Delete, View */}
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* View Action */}
                        <button
                          onClick={() => handleViewUser(user)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all border border-transparent hover:border-blue-200"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Approve / Pending Action */}
                        <button
                          onClick={() => handleToggleApprove(user)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${user.isPending
                            ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            }`}
                          title={user.isPending ? 'Click to Verify User' : 'Click to Set Unverified'}
                        >
                          {user.isPending ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-amber-600" />
                              <span>Verify</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Verified</span>
                            </>
                          )}
                        </button>

                        {/* Suspend / Unsuspend Action */}
                        <button
                          onClick={() => handleToggleBan(user)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${user.isBanned
                            ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-xs'
                            : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                            }`}
                          title={user.isBanned ? 'Click to Unsuspend User' : 'Click to Suspend User'}
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>{user.isBanned ? 'Unsuspend' : 'Suspend'}</span>
                        </button>

                        {/* Delete Action */}
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-200"
                          title="Delete User Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No users matching your search filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        initialUser={selectedUser}
      />
    </div>
  );
};
