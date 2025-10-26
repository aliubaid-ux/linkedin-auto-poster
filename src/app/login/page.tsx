'use client';

import { supabase } from '@/supabase/client';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">LinkFlow AI</h1>
        <p className="text-muted-foreground mb-8">AI-powered LinkedIn content generation and scheduling.</p>
        <Button onClick={handleLogin}>Login with LinkedIn</Button>
      </div>
    </div>
  );
}
