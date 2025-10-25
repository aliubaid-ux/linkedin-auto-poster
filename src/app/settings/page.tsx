"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-2">
      <h1 className="text-3xl font-semibold">Settings</h1>
      <p className="text-muted-foreground">Manage your application settings.</p>
      
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            This section is under construction.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>More settings and customization options will be available here in the future.</p>
        </CardContent>
      </Card>
    </div>
  );
}
