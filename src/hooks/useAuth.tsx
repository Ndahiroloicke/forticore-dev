import { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithPassword: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithPassword: (email: string, password: string) => Promise<{ error?: string }>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  verifyOTP: (email: string, token: string) => Promise<{ error?: string }>;
  resendOTP: (email: string) => Promise<{ error?: string }>;
  resendEmailConfirmation: (email: string) => Promise<{ error?: string }>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      // Missing envs; disable auth but keep app usable
      console.warn('[Auth] Supabase client unavailable. Check env vars.');
      setLoading(false);
      return;
    }

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);
    };
    init();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  const signInWithPassword = async (email: string, password: string) => {
    if (!supabase) return { error: 'Auth not configured. Missing env vars.' };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
  };

  const signUpWithPassword = async (email: string, password: string) => {
    if (!supabase) return { error: 'Auth not configured. Missing env vars.' };
    // Sign up without emailRedirectTo - this will trigger OTP email instead of magic link
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        // Don't auto-confirm, require email verification via OTP
        emailRedirectTo: undefined,
      }
    });
    if (error) return { error: error.message };
    return {};
  };

  const resendEmailConfirmation = async (email: string) => {
    if (!supabase) return { error: 'Auth not configured. Missing env vars.' };
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });
    if (error) return { error: error.message };
    return {};
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  const signInWithOAuth = async (provider: 'google' | 'github') => {
    if (!supabase) return { error: 'Auth not configured. Missing env vars.' };
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
    if (error) return { error: error.message };
    return {};
  };

  const verifyOTP = async (email: string, token: string) => {
    if (!supabase) return { error: 'Auth not configured. Missing env vars.' };
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup'
    });
    if (error) return { error: error.message };
    return {};
  };

  const resendOTP = async (email: string) => {
    if (!supabase) return { error: 'Auth not configured. Missing env vars.' };
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });
    if (error) return { error: error.message };
    return {};
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signInWithPassword, 
      signUpWithPassword, 
      signInWithOAuth, 
      signOut, 
      verifyOTP,
      resendOTP,
      resendEmailConfirmation 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};


