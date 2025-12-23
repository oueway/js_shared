'use client';

import React, { useState, useEffect } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { 
  User, 
  Loader2, 
  ShieldCheck, 
  CheckCircle,
  AlertCircle,
  X,
  Settings
} from 'lucide-react';
import { Button } from '../ui';
import ProfileView from './ProfileView';
import SecurityView from './SecurityView';

export interface SettingsTab {
  id: string;
  label: string;
  icon: any;
  component: React.ComponentType<any>;
  description?: string;
}

export interface SettingsPopupProps {
  supabase: SupabaseClient;
  isOpen: boolean;
  onClose: () => void;
  onSignOut?: () => void;
  additionalTabs?: SettingsTab[];
}

const Toast = ({ message, type, onClose }: { message?: string; type?: 'success' | 'error'; onClose: () => void }) => {
  if (!message) return null;
  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border animate-in slide-in-from-bottom-5 fade-in duration-300 ${
      type === 'error' ? 'bg-white border-red-100 text-red-600' : 'bg-white border-green-100 text-green-600'
    }`}>
      {type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
      <p className="text-sm font-medium text-slate-800">{message}</p>
      <button onClick={onClose} className="ml-2 hover:bg-slate-100 p-1 rounded-full">
        <X size={12} />
      </button>
    </div>
  );
};

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any; label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
      active 
        ? 'bg-indigo-50 text-indigo-700' 
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`}
  >
    <Icon size={18} className={active ? 'text-indigo-600' : 'text-slate-400'} />
    {label}
  </button>
);

export function SettingsPopup({ supabase, isOpen, onClose, onSignOut, additionalTabs = [] }: SettingsPopupProps) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('profile');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    
    setLoading(true);
    
    const initAuth = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      setSession(initialSession);
      setLoading(false);
    };
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
      if (newSession) {
        setCurrentView('profile');
      }
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [isOpen, supabase]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200" onClick={onClose} />
      
      {/* Popup */}
      <div className="fixed inset-0 sm:inset-4 md:inset-10 lg:inset-20 bg-white sm:rounded-2xl shadow-2xl z-50 flex flex-col animate-in zoom-in-95 fade-in duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors z-10"
        >
          <X size={20} className="text-slate-500" />
        </button>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : !session ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-sm">
              <AlertCircle size={32} className="text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-900">Not Signed In</h2>
              <p className="text-slate-500 mt-2 text-sm mb-6">
                Please sign in to access settings.
              </p>
              <Button loading={false} onClick={onClose}>Close</Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <aside className="hidden sm:flex w-64 border-r border-slate-200 flex-col">
              <h1 className="text-2xl font-bold text-slate-900 p-6 border-b border-slate-200">
                Settings
              </h1>
              
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                <SidebarItem 
                  icon={User} 
                  label="Profile" 
                  active={currentView === 'profile'} 
                  onClick={() => setCurrentView('profile')} 
                />
                <SidebarItem 
                  icon={ShieldCheck} 
                  label="Security" 
                  active={currentView === 'security'} 
                  onClick={() => setCurrentView('security')} 
                />
                {additionalTabs.map((tab) => (
                  <SidebarItem 
                    key={tab.id}
                    icon={tab.icon} 
                    label={tab.label} 
                    active={currentView === tab.id} 
                    onClick={() => setCurrentView(tab.id)} 
                  />
                ))}
              </nav>

              <div className="p-4 border-t border-slate-100">
                <div className="flex items-center gap-3 px-3 py-3 bg-slate-50 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold border border-indigo-200">
                    {session.user.email?.[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {session.user.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{session.user.email}</p>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-8">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Mobile Navigation */}
                <div className="sm:hidden mb-4 pr-12">
                  <select
                    value={currentView}
                    onChange={(e) => setCurrentView(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm font-medium bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                  >
                    <option value="profile">My Profile</option>
                    <option value="security">Login &amp; Security</option>
                    {additionalTabs.map((tab) => (
                      <option key={tab.id} value={tab.id}>{tab.label}</option>
                    ))}
                  </select>
                </div>

                {/* Header */}
                <header className="mb-8">
                  <h1 className="text-2xl font-bold text-slate-900">
                    {currentView === 'profile' && 'My Profile'}
                    {currentView === 'security' && 'Login & Security'}
                    {additionalTabs.find(tab => tab.id === currentView)?.label}
                  </h1>
                  <p className="text-slate-500 mt-1">
                    {currentView === 'profile' && 'Manage your personal information and public profile.'}
                    {currentView === 'security' && 'Update your password and secure your account.'}
                    {additionalTabs.find(tab => tab.id === currentView)?.description}
                  </p>
                </header>

                {/* Views */}
                {currentView === 'profile' && <ProfileView session={session} supabase={supabase} showToast={showToast} />}
                {currentView === 'security' && <SecurityView session={session} supabase={supabase} showToast={showToast} />}
                {additionalTabs.map((tab) => {
                  if (currentView === tab.id) {
                    const Component = tab.component;
                    return <Component key={tab.id} session={session} supabase={supabase} showToast={showToast} />;
                  }
                  return null;
                })}
              </div>
            </main>
          </div>
        )}
      </div>

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </>
  );
}
