import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import type { AuthError, User } from '@supabase/supabase-js'

export function useSupabaseUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error getting user:", error);
        setError(error);
      } else {
        setUser(data.user);
        setError(null);
      }
      setLoading(false);
    }

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  return { user, loading, error };
}
