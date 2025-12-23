'use client';

import React, { useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { Lock, ShieldCheck } from 'lucide-react';
import { Button, TextField } from '../ui';

interface SecurityViewProps {
  session: any;
  supabase: SupabaseClient;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export default function SecurityView({ session, supabase, showToast }: SecurityViewProps) {
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      showToast('Passwords do not match', 'error');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: passwords.new
    });
    setLoading(false);
    if (error) showToast(error.message, 'error');
    else {
      showToast('Password updated successfully');
      setPasswords({ new: '', confirm: '' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-6">
          <Lock size={20} className="text-indigo-500" /> Change Password
        </h3>
        <form onSubmit={handlePasswordUpdate} className="max-w-md space-y-4">
          <TextField 
            label="New Password" 
            type="password"
            value={passwords.new}
            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
          />
          <TextField 
            label="Confirm New Password" 
            type="password"
            value={passwords.confirm}
            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
          />
          <div className="pt-2">
            <Button type="submit" loading={loading} variant="secondary">Update Password</Button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-6">
          <ShieldCheck size={20} className="text-indigo-500" /> Two-Factor Authentication
        </h3>
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900">Add an extra layer of security</p>
            <p className="text-sm text-slate-500 mt-1">Protect your account by requiring a code when you log in.</p>
          </div>
          <Button disabled={true} loading={false} variant="secondary" className="shrink-0" onClick={() => showToast('2FA setup is just a UI demo', 'success')}>Enable 2FA</Button>
        </div>
      </div>
    </div>
  );
}
