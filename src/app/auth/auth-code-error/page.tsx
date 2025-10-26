import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthCodeError() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>Something went wrong during the login process.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Login Failed</AlertTitle>
            <AlertDescription>
              We were unable to log you in. This could be due to a temporary issue with LinkedIn or an invalid authentication code.
            </AlertDescription>
          </Alert>
          <div className="text-sm text-muted-foreground">
            <p className="font-semibold">What you can do:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Wait a few moments and try logging in again.</li>
              <li>Ensure you have authorized the application on LinkedIn.</li>
              <li>If the problem persists, please contact support.</li>
            </ul>
          </div>
          <Button asChild className="w-full">
            <Link href="/login">
              Return to Login
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
