# @oueway/auth-dashboard

Reusable authentication utilities and UI components for Supabase-powered Next.js applications.

## Features

- 🔐 Supabase SSR authentication utilities
- 🎨 Beautiful, customizable UI components
- 🛡️ Built-in route protection (middleware/proxy)
- 📱 Responsive design out of the box
- 🎯 Full TypeScript support
- 🔄 Works with multiple Supabase projects
- ⚡ Build your own auth pages with provided components

## Why This Approach?

This package provides **reusable utilities and components** rather than complete pages. This gives you:

- ✅ Full control over your auth flow and UI
- ✅ Easy customization for your brand
- ✅ Use the same package across multiple apps with different Supabase projects
- ✅ No lock-in to specific page structures
- ✅ Copy and adapt example code to your needs

## Installation

```bash
npm install @oueway/auth-dashboard @supabase/ssr @supabase/supabase-js lucide-react
# or
pnpm add @oueway/auth-dashboard @supabase/ssr @supabase/supabase-js lucide-react
```

## Quick Start

### 1. Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Create Supabase Client

```typescript
// lib/supabase.ts
import { createClient } from '@oueway/auth-dashboard/lib';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### 3. Add Authentication Proxy

```typescript
// proxy.ts (Next.js 16+) or middleware.ts (Next.js 15-)
import { createProxy } from '@oueway/auth-dashboard/lib';

export const proxy = createProxy({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  protectedRoutes: ['/dashboard', '/account'],
  authRoutes: ['/login', '/register'],
  redirectAfterLogin: '/dashboard',
  redirectAfterLogout: '/login',
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

### 4. Build Your Auth Pages

Use the provided components to build your own auth pages:

```typescript
// app/(auth)/login/page.tsx
"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button, Input } from '@oueway/auth-dashboard/components';
import { Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) window.location.href = '/dashboard';
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleLogin} className="w-full max-w-md space-y-4">
        <Input label="Email" type="email" icon={Mail} value={email} 
               onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Password" type="password" icon={Lock} value={password}
               onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit" loading={loading} className="w-full">
          Sign In
        </Button>
      </form>
    </div>
  );
}
```

## Complete Examples

See [USAGE.md](./USAGE.md) for complete examples of:
- Login page with OAuth
- Registration with duplicate email check
- Password reset flow
- Dashboard with profile management
- Multi-project setup

## Available Components

### UI Components

- **Button** - Loading states, variants (primary, secondary, danger, ghost)
- **Input** - Icons, labels, error states, validation
- **Toggle** - Switch component for settings
- **Toast** - Notification messages
- **HeaderLogo** - Customizable logo component

### Utilities

- **createClient** - Browser Supabase client
- **createServerClient** - Server component Supabase client
- **createProxy** - Authentication middleware/proxy

## Using Across Multiple Apps

Each app can use its own Supabase project:

```typescript
// App 1 - lib/supabase.ts
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,  // Project A URL
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!  // Project A Key
);

// App 2 - lib/supabase.ts
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,  // Project B URL
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!  // Project B Key
);
```

Both apps use the same components and patterns, but connect to different Supabase projects.

## Customization

### Custom Logo

```typescript
<HeaderLogo 
  onClick={() => router.push('/')}
  isNormalBackground={true}
  companyName="YourCompany"
  logoLetter="Y"
/>
```

Or provide custom JSX:

```typescript
<HeaderLogo onClick={() => router.push('/')} isNormalBackground={true}>
  <img src="/logo.png" alt="Logo" />
</HeaderLogo>
```

### Tailwind CSS

The components use Tailwind CSS classes. Make sure your project has Tailwind configured.

## TypeScript

Full TypeScript support with exported types:

```typescript
import type { AuthConfig, ProxyConfig } from '@oueway/auth-dashboard/lib';
import type { HeaderLogoProps } from '@oueway/auth-dashboard/components';
```

## License

MIT

## Contributing

Issues and pull requests are welcome!
