'use client';

import { createClient } from '@/lib/supabase-client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        setLoading(false);
        if (currentUser) {
          router.push('/');
        }
      }
    );
  
    // Check initial session
    const getInitialUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        setLoading(false);
        if (currentUser) {
            router.push('/');
        }
    };
    getInitialUser();


    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router, supabase.auth]);


  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'linkedin',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen bg-background">
            <p>Loading...</p>
        </div>
    )
  }

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="text-center p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold mb-4 text-primary">LinkFlow AI</h1>
        <p className="text-muted-foreground mb-8">
          AI-powered LinkedIn content generation and scheduling.
        </p>
        <Button onClick={handleLogin} size="lg" className="w-full">
          Login with LinkedIn
        </Button>
      </div>
    </div>
  );
}
