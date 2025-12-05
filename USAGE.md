# @oueway/auth-dashboard - Usage Example

This guide shows how to integrate the auth-dashboard package into your Next.js application.

## Project Structure

```
your-app/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── reset-password/
│   │       └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   └── layout.tsx
├── lib/
│   └── supabase.ts
├── proxy.ts (or middleware.ts for Next.js 15)
└── .env.local
```

## Step 1: Environment Setup

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Step 2: Create Supabase Client

```typescript
// lib/supabase.ts
import { createClient } from '@oueway/auth-dashboard/lib';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

## Step 3: Setup Authentication Proxy

```typescript
// proxy.ts (Next.js 16+) or middleware.ts (Next.js 15-)
import { createProxy } from '@oueway/auth-dashboard/lib';

export const proxy = createProxy({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  protectedRoutes: ['/dashboard', '/account', '/settings'],
  authRoutes: ['/login', '/register', '/reset-password'],
  redirectAfterLogin: '/dashboard',
  redirectAfterLogout: '/login',
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

## Step 4: Create Auth Pages

You'll need to create your own auth pages that use the package's UI components and utilities. Here's a template:

### Login Page

```typescript
// app/(auth)/login/page.tsx
"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button, Input } from '@oueway/auth-dashboard/components';
import { Mail, Lock } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      if (error) throw error;
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email"
            type="email"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Input
            label="Password"
            type="password"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button type="submit" loading={loading} className="w-full">
            Sign In
          </Button>
        </form>

        <p className="text-center mt-4 text-sm text-slate-600">
          Don't have an account?{' '}
          <Link href="/register" className="text-indigo-600 hover:text-indigo-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
```

### Register Page

```typescript
// app/(auth)/register/page.tsx
"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button, Input } from '@oueway/auth-dashboard/components';
import { Mail, Lock, User } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (error) throw error;
      
      if (data?.user?.identities && data.user.identities.length === 0) {
        throw new Error('An account with this email already exists.');
      }

      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            icon={User}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          
          <Input
            label="Email"
            type="email"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Input
            label="Password"
            type="password"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button type="submit" loading={loading} className="w-full">
            Sign Up
          </Button>
        </form>

        <p className="text-center mt-4 text-sm text-slate-600">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
```

## Step 5: Create Dashboard

Similar to auth pages, you'll create your own dashboard pages using the package's components.

## Customization

### Custom Logo

```typescript
import { HeaderLogo } from '@oueway/auth-dashboard/components';

<HeaderLogo 
  onClick={() => router.push('/')}
  isNormalBackground={true}
  companyName="YourCompany"
  logoLetter="Y"
/>
```

### Or provide custom children:

```typescript
<HeaderLogo 
  onClick={() => router.push('/')}
  isNormalBackground={true}
>
  <img src="/logo.png" alt="Logo" />
</HeaderLogo>
```

## Multiple Projects

To use this package across multiple projects:

1. Each project has its own `.env.local` with different Supabase credentials
2. Each project creates its own `lib/supabase.ts` passing its own credentials
3. Each project uses the same UI components and patterns
4. The authentication logic is consistent across all projects

## Benefits

- ✅ Consistent auth UI/UX across all your apps
- ✅ Single source of truth for auth logic
- ✅ Easy to update all apps by updating the package
- ✅ Each app can use its own Supabase project
- ✅ Customizable branding per app
