'use client';

import React, { useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { Mail, Loader2, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { TextField } from '../../components/ui';

export interface ForgotPasswordPageProps {
  supabase: SupabaseClient;
  logoLetter?: string;
  companyName?: string;
  resetPasswordUrl?: string;
  loginLink?: string;
}

export function createForgotPasswordPage(props: ForgotPasswordPageProps) {
  const {
    supabase,
    logoLetter = 'O',
    companyName,
    resetPasswordUrl,
    loginLink = '/login',
  } = props;

  return function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleResetPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setSuccess('');
      setLoading(true);

      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: resetPasswordUrl || `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setSuccess('Check your email for the password reset link!');
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-slate-50">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-[80px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-200/30 rounded-full blur-[100px]" />
        </div>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="bg-white p-8 pb-0 text-center">
            <div className="h-12 w-12 bg-indigo-600 rounded-xl mx-auto flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-200 mb-6">
              {logoLetter}
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Reset your password</h2>
            <p className="text-slate-500 mt-2 text-sm">
              {companyName ? `Enter your ${companyName} email to receive a reset link` : "Enter your email and we'll send you a reset link"}
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleResetPassword} className="space-y-4">
              <TextField
                label="Email"
                icon={Mail}
                type="email"
                name="email"
                autoComplete="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-start gap-2">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg flex items-start gap-2">
                  <CheckCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 inline-flex items-center justify-center rounded-lg px-4 py-2.5 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-lg shadow-indigo-500/30"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Reset Link
              </button>
            </form>

            {loginLink && (
              <div className="mt-6 text-center">
                <Link href={loginLink} className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 font-medium">
                  <ArrowLeft size={16} className="mr-1" />
                  Back to login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
}
