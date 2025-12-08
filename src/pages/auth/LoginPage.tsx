'use client';

import React, { useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { Mail, Lock, Loader2, AlertCircle, CheckCircle, Chrome, Apple, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { TextField } from '../../components/ui';
import { useAuthUIConfig } from '../../lib/auth-ui-config';
import { useSupabase } from '../../lib/context';
import { AuthHeader } from './AuthHeader';

export function createLoginPage() {
  return function LoginPage() {
    const supabase = useSupabase();
    const config = useAuthUIConfig();
    const {
      logo = 'O',
      appName = '',
      enableOAuth = true,
      oauthProviders = [],
      redirectAfterLogin = '',
      forgotPasswordLink = '',
      registerLink = '',
      authCallbackUrl,
      homePage = '/',
    } = config;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [authTypeLoading, setAuthTypeLoading] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const signInWithPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setSuccess('');
      setAuthTypeLoading('email');

      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setSuccess('Welcome back!');
        setTimeout(() => (window.location.href = redirectAfterLogin), 1000);
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
          <AuthHeader
            homePage={homePage}
            logo={logo}
            title={appName ? `Welcome to ${appName}` : 'Welcome back'}
            subtitle="Enter your credentials to access your account"
          />

          {/* Form */}
          <div className="p-8">
            <form onSubmit={signInWithPassword} className="space-y-4">
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

              <TextField
                label="Password"
                icon={Lock}
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                labelRight={
                  forgotPasswordLink ? (
                    <Link href={forgotPasswordLink} className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
                      Forgot password?
                    </Link>
                  ) : undefined
                }
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
                className="w-full h-11 text-base inline-flex items-center justify-center rounded-lg px-4 py-2.5 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-lg shadow-indigo-500/30"
              >
                {authTypeLoading === 'email' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
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

            {registerLink && (
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-500">
                  Don't have an account?
                  <Link href={registerLink} className="ml-1.5 font-semibold text-indigo-600 hover:text-indigo-500">
                    Sign up
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
