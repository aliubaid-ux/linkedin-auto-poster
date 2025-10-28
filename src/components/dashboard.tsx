'use client';

import { createClient } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <div className="text-center p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold mb-4 text-primary">Welcome to your Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          You are successfully logged in.
        </p>
        <Button onClick={handleLogout} size="lg" className="w-full">
          Logout
        </Button>
      </div>
    </div>
  );
}
