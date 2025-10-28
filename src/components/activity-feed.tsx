'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardCopy, Loader2, PenSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/app-provider";
import { useMemo } from "react";

export function ActivityFeed() {
  const { toast } = useToast();
  const { drafts, loading } = useAppContext();

  const sortedDrafts = useMemo(() => {
    return [...drafts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [drafts]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  const renderSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
        <CardDescription>Your recent drafts and their current status.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          renderSkeleton()
        ) : sortedDrafts.length > 0 ? (
          sortedDrafts.slice(0, 5).map((draft, index) => (
            <div key={draft.id}>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                   <PenSquare className="h-4 w-4 text-muted-foreground" />
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
              {index < sortedDrafts.slice(0, 5).length - 1 && <Separator className="my-4" />}
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
