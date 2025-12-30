import React from 'react';
import { Mail, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const emailProviders: Record<string, string> = {
  'gmail.com': 'https://mail.google.com',
  'outlook.com': 'https://outlook.live.com',
  'hotmail.com': 'https://outlook.live.com',
  'live.com': 'https://outlook.live.com',
  'yahoo.com': 'https://mail.yahoo.com',
  'icloud.com': 'https://www.icloud.com/mail',
  'qq.com': 'https://mail.qq.com',
  '163.com': 'https://mail.163.com',
  '126.com': 'https://mail.126.com',
  'sina.com': 'https://mail.sina.com.cn',
  'sohu.com': 'https://mail.sohu.com',
  'protonmail.com': 'https://mail.proton.me',
  'me.com': 'https://www.icloud.com/mail',
  'mac.com': 'https://www.icloud.com/mail',
};

const getEmailLink = (email: string) => {
  if (!email) return null;
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return null;
  return emailProviders[domain] || `https://${domain}`;
};

interface EmailVerificationSuccessProps {
  email: string;
  title?: string;
  message?: string;
  loginLink?: string;
  onBackToLogin?: () => void;
}

export function EmailVerificationSuccess({
  email,
  title = 'Check Your Email',
  message,
  loginLink,
  onBackToLogin,
}: EmailVerificationSuccessProps) {
  return (
    <div className="p-8 text-center">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-3">{title}</h2>
      <p className="text-slate-600 mb-8">
        {message || (
          <>
            We have sent a verification email to <span className="font-medium text-slate-900 block mt-1">{email}</span>
          </>
        )}
      </p>

      <div className="space-y-4">
        <a
          href={getEmailLink(email) || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center h-11 rounded-lg px-4 py-2.5 bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
        >
          <Mail className="w-5 h-5 mr-2" />
          Open {email.split('@')[1] ? email.split('@')[1] : 'Email'}
        </a>

        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-sm text-amber-800 text-left flex gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>
            Can't find the email? Please check your <strong>Spam</strong> or <strong>Junk</strong> folder.
          </p>
        </div>
      </div>

      {(loginLink || onBackToLogin) && (
        <div className="mt-8 pt-6 border-t border-slate-100">
          {loginLink ? (
            <Link
              href={loginLink}
              className="text-slate-600 hover:text-indigo-600 font-medium text-sm transition-colors"
            >
              Back to Log In
            </Link>
          ) : (
            <button
              onClick={onBackToLogin}
              className="text-slate-600 hover:text-indigo-600 font-medium text-sm transition-colors"
            >
              Back to Log In
            </button>
          )}
        </div>
      )}
    </div>
  );
}
