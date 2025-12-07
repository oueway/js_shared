'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

export interface AuthConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

interface AuthContextValue {
  config: AuthConfig;
  supabase: SupabaseClient;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuthConfig() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthConfig must be used within AuthProvider');
  }
  return context;
}

export function useSupabase() {
  const { supabase } = useAuthConfig();
  return supabase;
}

interface AuthProviderProps {
  config: AuthConfig;
  supabase: SupabaseClient;
  children: ReactNode;
}

export function AuthProvider({ config, supabase, children }: AuthProviderProps) {
  return (
    <AuthContext.Provider value={{ config, supabase }}>
      {children}
    </AuthContext.Provider>
  );
}
