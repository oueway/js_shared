import Link from 'next/link';
import { AppLogo } from './components/AppLogo';

export default function Home() {
  const links = [
    { href: '/auth/login', label: 'Login' },
    { href: '/auth/register', label: 'Register' },
    { href: '/auth/forgot-password', label: 'Forgot Password' },
    { href: '/auth/reset-password', label: 'Reset Password' },
  ];

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
        <div className="mb-4">
          <AppLogo />
        </div>
        <div className="space-y-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block w-full text-center py-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
