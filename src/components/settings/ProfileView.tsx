'use client';

import React, { useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { User, Camera, LayoutDashboard } from 'lucide-react';
import { Button, TextField } from '../ui';

interface ProfileViewProps {
  session: any;
  supabase: SupabaseClient;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export default function ProfileView({ session, supabase, showToast }: ProfileViewProps) {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(session.user.user_metadata?.full_name || '');

  const handleUpdate = async () => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName }
    });
    setLoading(false);
    if (error) showToast(error.message, 'error');
    else showToast('Profile updated successfully');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="relative">
              <div className="h-24 w-24 bg-white rounded-full p-1 shadow-lg">
                <div className="h-full w-full bg-slate-100 rounded-full flex items-center justify-center text-slate-300 relative overflow-hidden">
                  <User size={40} />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center group cursor-pointer">
                    <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                  </div>
                </div>
              </div>
            </div>
            <Button onClick={handleUpdate} loading={loading}>Save Changes</Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <User size={20} className="text-indigo-500" /> Personal Details
              </h3>
              <TextField 
                label="Full Name" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
              />
              <TextField 
                label="Email Address" 
                value={session.user.email} 
                disabled 
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <LayoutDashboard size={20} className="text-indigo-500" /> Metadata
              </h3>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Join Date</span>
                  <span className="font-mono text-slate-700 text-xs">{new Date(session.user.created_at || Date.now()).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Last Sign In</span>
                  <span className="font-mono text-slate-700 text-xs">{new Date(session.user.last_sign_in_at || Date.now()).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Provider</span>
                  <span className="text-slate-700 capitalize">{session.user.app_metadata?.provider || 'email'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
