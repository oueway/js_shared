'use client';

import React, { useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { Mail, Lock, User, Loader2, AlertCircle, CheckCircle, Chrome, Apple, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export interface RegisterPageProps {
  supabase: SupabaseClient;
  logoLetter?: string;
  companyName?: string;
  enableOAuth?: boolean;
  oauthProviders?: Array<'google' | 'apple'>;
  redirectAfterRegister?: string;
  loginLink?: string;
  authCallbackUrl?: string;
}

export function createRegisterPage(props: RegisterPageProps) {
  const {
    supabase,
    logoLetter = 'O',
    companyName,
    enableOAuth = true,
    oauthProviders = ['google', 'apple'],
    redirectAfterRegister = '/',
    loginLink = '/login',
    authCallbackUrl,
  } = props;

  return function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [authTypeLoading, setAuthTypeLoading] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const signUp = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setSuccess('');
      setAuthTypeLoading('email');

      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: authCallbackUrl || (typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined),
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) throw error;

        // Check if user already exists
        if (data?.user?.identities && data.user.identities.length === 0) {
          throw new Error('An account with this email already exists. Please login instead.');
        }

        setSuccess('Account created successfully! Check your email to confirm.');
        setTimeout(() => (window.location.href = redirectAfterRegister), 2000);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setAuthTypeLoading(null);
      }
    };

    const signInWithProvider = async (provider: 'google' | 'apple') => {
      setError('');
      setAuthTypeLoading(provider);

      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: authCallbackUrl || `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
      } catch (err: any) {
        setError(err.message);
      } finally {
        setAuthTypeLoading(null);
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
            <h2 className="text-2xl font-bold text-slate-900">
              {companyName ? `Join ${companyName}` : 'Create an account'}
            </h2>
            <p className="text-slate-500 mt-2 text-sm">Enter your details to get started</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={signUp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 block">Full Name</label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 rounded-lg py-2.5 pl-10 pr-3 text-sm outline-none transition-all focus:ring-4 placeholder:text-slate-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 block">Email</label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 rounded-lg py-2.5 pl-10 pr-3 text-sm outline-none transition-all focus:ring-4 placeholder:text-slate-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 block">Password</label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 rounded-lg py-2.5 pl-10 pr-10 text-sm outline-none transition-all focus:ring-4 placeholder:text-slate-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

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
                disabled={authTypeLoading === 'email'}
                className="w-full h-11 inline-flex items-center justify-center rounded-lg px-4 py-2.5 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-lg shadow-indigo-500/30"
              >
                {authTypeLoading === 'email' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign Up
              </button>
            </form>

            {enableOAuth && oauthProviders.length > 0 && (
              <>
                {/* Divider */}
                <div className="relative flex items-center py-4">
                  <div className="grow border-t border-slate-200"></div>
                  <span className="shrink mx-4 text-xs text-slate-500 uppercase">OR</span>
                  <div className="grow border-t border-slate-200"></div>
                </div>

                {/* Social Logins */}
                <div className="space-y-3">
                  {oauthProviders.includes('google') && (
                    <button
                      onClick={() => signInWithProvider('google')}
                      disabled={authTypeLoading === 'google'}
                      className="w-full h-11 text-slate-600 hover:bg-slate-50 hover:border-slate-300 inline-flex items-center justify-center rounded-lg px-4 py-2.5 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none bg-white border border-slate-200 shadow-sm"
                    >
                      {authTypeLoading === 'google' ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        <Chrome size={20} className="mr-2" />
                      )}
                      Continue with Google
                    </button>
                  )}
                  {oauthProviders.includes('apple') && (
                    <button
                      onClick={() => signInWithProvider('apple')}
                      disabled={authTypeLoading === 'apple'}
                      className="w-full h-11 text-slate-600 hover:bg-slate-50 hover:border-slate-300 inline-flex items-center justify-center rounded-lg px-4 py-2.5 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none bg-white border border-slate-200 shadow-sm"
                    >
                      {authTypeLoading === 'apple' ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        <Apple size={20} className="mr-2" />
                      )}
                      Continue with Apple
                    </button>
                  )}
                </div>
              </>
            )}

            {loginLink && (
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-500">
                  Already have an account?
                  <Link href={loginLink} className="ml-1.5 font-semibold text-indigo-600 hover:text-indigo-500">
                    Log in
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
}
