'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { LinkedInIcon } from "@/components/icons";
import { Check, X } from 'lucide-react';

export default function ConnectPage() {
    const { toast } = useToast();
    // Mock connection status
    const isConnected = false;

    const handleConnect = () => {
        toast({ title: "Connecting to LinkedIn..." });
        // Simulate API call
        setTimeout(() => {
            toast({ title: "Successfully connected to LinkedIn!" });
        }, 2000);
    };

    const handleDisconnect = () => {
        toast({ title: "Disconnecting from LinkedIn...", variant: "destructive" });
         // Simulate API call
        setTimeout(() => {
            toast({ title: "Successfully disconnected from LinkedIn." });
        }, 2000);
    };


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
