"use client";

import { useAppContext } from "@/context/app-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ConnectPage() {
    const { profile, setProfile } = useAppContext();
    const { toast } = useToast();

    const handleConnect = () => {
        // Mocking the OAuth flow
        toast({ title: "Redirecting to LinkedIn..." });
        setTimeout(() => {
            setProfile({ ...profile, linkedinConnected: true });
            toast({ title: "Successfully connected to LinkedIn!" });
        }, 2000);
    };

    const handleDisconnect = () => {
        setProfile({ ...profile, linkedinConnected: false });
        toast({ title: "Disconnected from LinkedIn.", variant: "destructive" });
    };

    return (
        <div className="mx-auto grid w-full max-w-2xl gap-2">
            <h1 className="text-3xl font-semibold">Connections</h1>
            <p className="text-muted-foreground">Manage your social media connections.</p>
            
            <Card className="mt-4">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="space-y-1.5">
                        <CardTitle>LinkedIn</CardTitle>
                        <CardDescription>Connect your LinkedIn account to enable automated posting.</CardDescription>
                    </div>
                    {profile.linkedinConnected ? (
                        <CheckCircle className="h-8 w-8 text-green-500" />
                    ) : (
                        <XCircle className="h-8 w-8 text-destructive" />
                    )}
                </CardHeader>
                <CardContent>
                    {profile.linkedinConnected ? (
                        <div className="flex flex-col items-start gap-4">
                            <p>Your account is connected and ready to post.</p>
                            <Button variant="destructive" onClick={handleDisconnect}>
                                Disconnect
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-start gap-4">
                            <p>Your account is not connected. Please connect to continue.</p>
                            <Button onClick={handleConnect}>
                                <LogIn className="mr-2 h-4 w-4" /> Connect to LinkedIn
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
