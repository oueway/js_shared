'use client';

import React, { useState, useEffect } from 'react';
import { useSupabaseClient } from '../../lib/supabase-client';
import { SettingsPopup } from '@oueway/js-shared/components';
import { Settings, LogOut, User as UserIcon, LayoutDashboard, TrendingUp, Users, Activity } from 'lucide-react';
import { AppLogo } from '../components/AppLogo';

export default function DashboardPage() {
  const supabase = useSupabaseClient();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    window.location.href = '/auth/login';
    return null;
  }

  const stats = [
    { icon: Users, label: 'Total Users', value: '2,543', change: '+12%', color: 'indigo' },
    { icon: Activity, label: 'Active Now', value: '432', change: '+5%', color: 'green' },
    { icon: TrendingUp, label: 'Growth', value: '24.5%', change: '+2.3%', color: 'blue' },
    { icon: LayoutDashboard, label: 'Projects', value: '12', change: '+3', color: 'purple' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <AppLogo />
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <Settings size={18} />
                <span className="hidden sm:inline">Settings</span>
              </button>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Welcome back, {user.user_metadata?.full_name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="mt-2 text-slate-600">
            Here's what's happening with your account today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                  <stat.icon className={`text-${stat.color}-600`} size={24} />
                </div>
                <span className={`text-sm font-semibold text-${stat.color}-600`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-sm font-medium text-slate-600">{stat.label}</h3>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <div className="shrink-0 mx-auto sm:mx-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-indigo-100 flex items-center justify-center">
                <UserIcon className="text-indigo-600" size={32} />
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                {user.user_metadata?.full_name || 'User'}
              </h2>
              <p className="text-slate-600 mb-4">{user.email}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-slate-700">User ID:</span>
                  <p className="text-slate-600 font-mono text-xs mt-1 bg-slate-50 p-2 rounded">
                    {user.id}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Account Created:</span>
                  <p className="text-slate-600 mt-1">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 sm:mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
            >
              <Settings className="text-slate-600 group-hover:text-indigo-600" size={24} />
              <div className="text-left">
                <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600">
                  Account Settings
                </h3>
                <p className="text-sm text-slate-600">Manage your profile</p>
              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group">
              <Activity className="text-slate-600 group-hover:text-indigo-600" size={24} />
              <div className="text-left">
                <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600">
                  View Activity
                </h3>
                <p className="text-sm text-slate-600">Check recent actions</p>
              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group">
              <TrendingUp className="text-slate-600 group-hover:text-indigo-600" size={24} />
              <div className="text-left">
                <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600">
                  Analytics
                </h3>
                <p className="text-sm text-slate-600">View your stats</p>
              </div>
            </button>
          </div>
        </div>
      </main>

      {/* Settings Popup */}
      <SettingsPopup
        supabase={supabase}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSignOut={handleSignOut}
      />
    </div>
  );
}
