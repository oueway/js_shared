'use client';

import React, { useState, useEffect } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { Lock, Loader2, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { TextField } from '../../components/ui';

export interface ResetPasswordPageProps {
  supabase: SupabaseClient;
  logoLetter?: string;
  companyName?: string;
  redirectAfterReset?: string;
  loginLink?: string;
}

export function createResetPasswordPage(props: ResetPasswordPageProps) {
  const {
    supabase,
    logoLetter = 'O',
    companyName,
    redirectAfterReset = '/login',
    loginLink = '/login',
  } = props;

  return function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const searchParams = useSearchParams();

    useEffect(() => {
      // Check for error in URL
      const errorParam = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      if (errorParam) {
        setError(errorDescription || 'Invalid or expired reset link');
      }
    }, [searchParams]);

    const handleResetPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setSuccess('');

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      setLoading(true);

      try {
        const { error } = await supabase.auth.updateUser({
          password: password,
        });

        if (error) throw error;

        setSuccess('Password updated successfully! Redirecting to login...');
        setTimeout(() => {
          window.location.href = redirectAfterReset;
        }, 2000);
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
            <h2 className="text-2xl font-bold text-slate-900">Set new password</h2>
            <p className="text-slate-500 mt-2 text-sm">
              {companyName ? `Enter your new ${companyName} password` : 'Enter your new password below'}
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleResetPassword} className="space-y-4">
              <TextField
                label="New Password"
                icon={Lock}
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />

              <TextField
                label="Confirm Password"
                icon={Lock}
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirm-password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
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
                Update Password
              </button>
            </form>

            {loginLink && (
              <div className="mt-6 text-center">
                <a href={loginLink} className="text-sm text-slate-600 hover:text-slate-900 font-medium">
                  Back to login
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
}
