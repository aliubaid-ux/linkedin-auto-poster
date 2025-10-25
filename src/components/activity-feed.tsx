'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardCopy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { DraftPost } from "@/lib/types";

interface ActivityFeedProps {
  drafts: DraftPost[];
}

export function ActivityFeed({ drafts }: ActivityFeedProps) {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
        <CardDescription>Your recent drafts and their current status.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {drafts.length > 0 ? (
          drafts.slice(0, 5).map((draft, index) => (
            <div key={draft.id}>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <span className="text-sm font-medium">{drafts.length - index}</span>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium leading-none">{draft.topic}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {draft.optimized_text}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <Badge variant={draft.status === 'posted' ? 'default' : 'secondary'}>
                    {draft.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(draft.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => copyToClipboard(draft.optimized_text)}
                >
                  <ClipboardCopy className="h-4 w-4" />
                </Button>
              </div>
              {index < drafts.slice(0, 5).length - 1 && <Separator className="my-4" />}
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No activity yet. Generate a post to get started!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
