'use client';

import React, { useState } from 'react';
import { Mail, Lock, User, Loader2, AlertCircle, CheckCircle, Chrome, Apple, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { TextField } from '../../components/ui';
import { useAuthUIConfig } from '../../lib/auth-ui-config';
import { useSupabase } from '../../lib/context';
import { AuthHeader } from './AuthHeader';

export function createRegisterPage() {
  return function RegisterPage() {
    const supabase = useSupabase();
    const config = useAuthUIConfig();
    const {
      logo,
      appName,
      enableOAuth = true,
      oauthProviders = ['google', 'apple'],
      redirectAfterRegister = '/',
      loginLink = '/login',
      authCallbackUrl,
      homePage,
      legalLinks,
    } = config;

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
      <div className="min-h-screen flex flex-col p-4 relative overflow-hidden bg-slate-50">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-[80px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-200/30 rounded-full blur-[100px]" />
        </div>

        <AuthHeader homePage={homePage} logo={logo} appName={appName} />

        {/* Form centered */}
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="px-8 pt-8 pb-0 text-center">
              <h2 className="text-2xl font-bold text-slate-700">{appName ? `Sign up for ${appName}` : 'Sign up'}</h2>
            </div>

            {/* Form */}
            <div className="p-8">
            <form onSubmit={signUp} className="space-y-4">
              <TextField
                label="Full Name"
                icon={User}
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              <TextField
                label="Email"
                icon={Mail}
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Input your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <TextField
                label="Password"
                icon={Lock}
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="new-password"
                placeholder="Input your password"
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

              {legalLinks && legalLinks.length > 0 && (
                <p className="mt-4 text-xs text-center text-slate-500">
                  By signing up, you agree to our{' '}
                  {legalLinks.map((link, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && (i === legalLinks.length - 1 ? ' and ' : ', ')}
                      <Link
                        href={link.href}
                        className="underline hover:text-slate-700 transition-colors"
                        target="_blank"
                      >
                        {link.label}
                      </Link>
                    </React.Fragment>
                  ))}.
                </p>
              )}
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
      </div>
    );
  };
}
