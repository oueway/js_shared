'use client';

import { useState } from 'react';
import { createBrowserClient, type SupabaseClient } from '@supabase/ssr';

const getSupabaseKeys = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  return { url, anonKey };
};

export function useSupabaseClient(): SupabaseClient {
  const [client] = useState(() => {
    const { url, anonKey } = getSupabaseKeys();
    return createBrowserClient(url, anonKey);
  });
  return client;
}
