'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Loader2, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { TextField } from '../../components/ui';
import { useAuthUIConfig } from '../../lib/auth-ui-config';
import { useSupabase } from '../../lib/context';
import { AuthHeader } from './AuthHeader';
import { EmailVerificationSuccess } from './EmailVerificationSuccess';

export function createForgotPasswordPage() {
  return function ForgotPasswordPage() {
    const supabase = useSupabase();
    const config = useAuthUIConfig();
    const { logo, appName, loginLink, homePage, resetPasswordLink } = config;

    const router = useRouter();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
      const successParam = searchParams?.get('success');
      const emailParam = searchParams?.get('email');
      if (successParam === 'true' && emailParam) {
        setSuccess('Check your email for the password reset link!');
        setEmail(emailParam);
      }
    }, [searchParams]);

    const handleResetPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setSuccess('');
      setLoading(true);

      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: resetPasswordLink,
        });
        if (error) throw error;
        setSuccess('Check your email for the password reset link!');
        router.push(`?success=true&email=${encodeURIComponent(email)}`);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
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
            {success ? (
              <EmailVerificationSuccess
                email={email}
                title="Check Your Email"
                message={`If your email is registered with us, ${email} will receive a password reset link shortly.`}
                loginLink={loginLink}
              />
            ) : (
              <>
            <div className="px-8 pt-8 pb-0 text-center">
              <h2 className="text-2xl font-bold text-slate-700">Reset your password</h2>
              <p className="text-slate-500 mt-2 text-sm">If your email is registered, we'll send you a reset link</p>
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
                placeholder="Input your email"
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
            </>
            )}
          </div>
        </div>
      </div>
    );
  };
}
