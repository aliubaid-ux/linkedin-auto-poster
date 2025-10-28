'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { LinkedInIcon } from "@/components/icons";
import { Check, X } from 'lucide-react';
import { createClient } from "@/lib/supabase-client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function ConnectPage() {
    const { toast } = useToast();
    const router = useRouter();
    const supabase = createClient();

    const [user, setUser] = useState<User | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            setIsConnected(!!currentUser);
            setLoading(false);
        };

        checkSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            setIsConnected(!!currentUser);
            if (event === 'SIGNED_OUT') {
                router.push('/login');
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [router, supabase.auth]);

    const handleConnect = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'linkedin',
            options: {
              redirectTo: `${location.origin}/auth/callback`,
            },
        });
    };

    const handleDisconnect = async () => {
        await supabase.auth.signOut();
        toast({ title: "Successfully disconnected." });
    };

    if (loading) {
        return (
            <div className="grid gap-6">
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>Connections</CardTitle>
                        <CardDescription>Connect your social accounts to automate your workflow.</CardDescription>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <p>Loading connection status...</p>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="grid gap-6">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Connections</CardTitle>
            <CardDescription>Connect your social accounts to automate your workflow.</CardDescription>
          </CardHeader>
        </Card>
        <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <LinkedInIcon className="h-8 w-8" />
            <div className="grid gap-1.5">
              <h3 className="text-lg font-semibold">LinkedIn</h3>
              <p className="text-sm text-muted-foreground">Automate your posts and grow your network.</p>
            </div>
          </div>
          <div className={cn(
            "flex items-center gap-2 rounded-md px-3 py-1 text-sm font-medium",
            isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800",
          )}>
            {isConnected ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
            {isConnected ? "Connected" : "Not Connected"}
          </div>
        </CardHeader>
        <CardContent>
          {isConnected ? (
            <div className="flex flex-col items-start gap-4">
                <p>Your account is connected and ready to post.</p>
                <Button variant="destructive" onClick={handleDisconnect}>
                    Disconnect
                </Button>
            </div>
           ) : (
            <div className="flex flex-col items-start gap-4">
                <p>Your account is not connected. Please connect to continue.</p>
                 <Button onClick={handleConnect} >
                    <LinkedInIcon className="mr-2 h-4 w-4" /> Connect with LinkedIn
                </Button>
            </div>
           )}
        </CardContent>
      </Card>
      </div>
    );
}
