import Link from 'next/link';

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
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">JS</div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">JS Shared Example</h1>
            <p className="text-slate-500 text-sm">Test the auth pages locally</p>
          </div>
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
