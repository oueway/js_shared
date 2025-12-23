'use client';

import React, { useState } from 'react';
import { Bell, Settings, Moon, Sun, Smartphone, Trash2 } from 'lucide-react';
import { Button, Toggle } from '@oueway/js-shared';

interface PreferencesViewProps {
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export default function PreferencesView({ showToast }: PreferencesViewProps) {
  const [notifications, setNotifications] = useState({ email: true, push: false, promo: true });
  const [theme, setTheme] = useState('system');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <Bell size={20} className="text-indigo-500" />
          <h3 className="text-lg font-semibold text-slate-900">Notifications</h3>
        </div>
        
        <div className="space-y-1 divide-y divide-slate-100">
          <Toggle 
            label="Email Notifications" 
            description="Receive daily summaries of your activity."
            checked={notifications.email} 
            onChange={(v) => { setNotifications({...notifications, email: v}); showToast('Preference saved'); }} 
          />
          <Toggle 
            label="Push Notifications" 
            description="Get real-time updates on your device."
            checked={notifications.push} 
            onChange={(v) => { setNotifications({...notifications, push: v}); showToast('Preference saved'); }} 
          />
          <Toggle 
            label="Promotional Emails" 
            description="Receive news about new features and updates."
            checked={notifications.promo} 
            onChange={(v) => { setNotifications({...notifications, promo: v}); showToast('Preference saved'); }} 
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <Settings size={20} className="text-indigo-500" />
          <h3 className="text-lg font-semibold text-slate-900">Appearance</h3>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <button 
            onClick={() => setTheme('light')}
            className={`p-4 border rounded-xl flex flex-col items-center gap-3 transition-all ${theme === 'light' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-slate-300'}`}
          >
            <Sun size={24} className={theme === 'light' ? 'text-indigo-600' : 'text-slate-500'} />
            <span className={`text-sm font-medium ${theme === 'light' ? 'text-indigo-700' : 'text-slate-600'}`}>Light</span>
          </button>
          <button 
            onClick={() => setTheme('dark')}
            className={`p-4 border rounded-xl flex flex-col items-center gap-3 transition-all ${theme === 'dark' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-slate-300'}`}
          >
            <Moon size={24} className={theme === 'dark' ? 'text-indigo-600' : 'text-slate-500'} />
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-indigo-700' : 'text-slate-600'}`}>Dark</span>
          </button>
          <button 
            onClick={() => setTheme('system')}
            className={`p-4 border rounded-xl flex flex-col items-center gap-3 transition-all ${theme === 'system' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-slate-300'}`}
          >
            <Smartphone size={24} className={theme === 'system' ? 'text-indigo-600' : 'text-slate-500'} />
            <span className={`text-sm font-medium ${theme === 'system' ? 'text-indigo-700' : 'text-slate-600'}`}>System</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8">
        <div className="flex items-center gap-3 mb-4">
          <Trash2 size={20} className="text-red-500" />
          <h3 className="text-lg font-semibold text-red-700">Danger Zone</h3>
        </div>
        <p className="text-sm text-slate-600 mb-6">
          Permanently remove your Personal Data and everything associated with your account. This action cannot be undone.
        </p>
        <Button loading={false} variant="danger" onClick={() => showToast('This is just a demo!', 'error')}>Delete Account</Button>
      </div>

    </div>
  );
}
