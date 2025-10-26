'use client';

import { createClient } from '@/lib/supabase-client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSupabaseUser } from '@/supabase/use-user';
import { AuthSessionMissingError } from '@supabase/supabase-js';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, error } = useSupabaseUser();
  const supabase = createClient();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  // Ignore the initial session missing error, as it's expected on the login page.
  const shouldShowLoading = loading || (user && !error) || (error && !(error instanceof AuthSessionMissingError));


  if (shouldShowLoading) {
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
