import { useState, useEffect, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = useCallback(async (data: SignUpData): Promise<{ error: AuthError | null }> => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
        }
      }
    });
    
    return { error };
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error };
  }, []);

  const signOut = useCallback(async (): Promise<{ error: AuthError | null }> => {
    const { error } = await supabase.auth.signOut();
    return { error };
  }, []);

  return {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!session,
  };
};
