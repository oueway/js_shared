# SettingsPopup Component

A reusable, full-featured settings popup component for managing user profiles, security, and preferences.

## Features

- **Dashboard View**: Overview of account activity and metrics
- **Profile Management**: Edit user information and view metadata
- **Security Settings**: Change password and enable 2FA
- **Preferences**: Manage notifications, appearance themes, and account settings
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Toast Notifications**: Built-in success/error feedback

## Installation

The SettingsPopup is part of `@oueway/js-shared`:

```bash
pnpm add @oueway/js-shared
```

## Basic Usage

```tsx
'use client';

import { SettingsPopup } from '@oueway/js-shared/components';
import { supabase } from '@/lib/supabase';

export default function MyPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Open Settings
      </button>

      <SettingsPopup
        supabase={supabase}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSignOut={() => window.location.href = '/'}
      />
    </>
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `supabase` | `SupabaseClient` | Yes | Supabase client instance |
| `isOpen` | `boolean` | Yes | Controls popup visibility |
| `onClose` | `() => void` | Yes | Callback when popup is closed |
| `logoComponent` | `React.ReactNode` | No | Custom logo component for sidebar |
| `onSignOut` | `() => void` | No | Callback after user signs out |

## Advanced Usage

### With Custom Logo

```tsx
import HeaderLogo from '@/components/HeaderLogo';

<SettingsPopup
  supabase={supabase}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  logoComponent={
    <HeaderLogo 
      onClick={() => window.location.href = '/'} 
      isNormalBackground={true} 
    />
  }
/>
```

### With Sign Out Handler

```tsx
<SettingsPopup
  supabase={supabase}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSignOut={() => {
    // Custom sign out logic
    console.log('User signed out');
    window.location.href = '/login';
  }}
/>
```

## Features Breakdown

### Dashboard View
- Team metrics and statistics
- Account information overview
- Login provider details
- User ID and metadata

### Profile View
- Edit full name
- View email (read-only)
- Display user metadata
- Profile avatar placeholder with upload UI

### Security View
- Password change form
- Two-factor authentication toggle
- Password validation

### Preferences View
- Email notification settings
- Push notification toggle
- Promotional email preferences
- Theme selector (Light/Dark/System)
- Account deletion option

## Styling

The component uses Tailwind CSS classes. Ensure your project has Tailwind configured:

```js
// tailwind.config.js
module.exports = {
  content: [
    './node_modules/@oueway/js-shared/**/*.{js,ts,jsx,tsx}',
    // ... your other paths
  ],
  // ... rest of config
}
```

## Requirements

- React 18+
- Supabase client
- Tailwind CSS 3+
- lucide-react icons

## Example Integration

See the complete example in the `example/` directory of the js-shared package.

```tsx
// app/dashboard/page.tsx
'use client';

import React, { useState } from 'react';
import { SettingsPopup } from '@oueway/js-shared/components';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="p-8">
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
      >
        Settings
      </button>

      <SettingsPopup
        supabase={supabase}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSignOut={() => window.location.href = '/'}
      />
    </div>
  );
}
```

## Notes

- The popup automatically fetches user session from Supabase
- All forms include validation and error handling
- Toast notifications appear for 3 seconds
- The popup uses a fixed overlay with z-index of 40-50
- Profile updates modify `user_metadata.full_name`
- Password updates require current session
