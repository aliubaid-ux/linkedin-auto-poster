"use client";

import { useState } from "react";
import { useAppContext } from "@/context/app-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Bot,
  ClipboardCopy,
  Edit,
  Save,
  Share2,
  ThumbsUp,
  MessageSquare,
  Eye,
  BarChart2,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import type { DraftPost } from "@/lib/types";
import { ClientOnly } from "@/components/client-only";

function DraftCard({ draft }: { draft: DraftPost }) {
  const { toast } = useToast();
  const { updateDraft } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(draft.optimized_text);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  const handleSave = () => {
    updateDraft({ ...draft, optimized_text: editedText });
    setIsEditing(false);
    toast({ title: "Draft saved!" });
  };
  
  const handlePost = () => {
    updateDraft({ ...draft, status: 'posted', postedAt: new Date().toISOString() });
    toast({ title: "Post published!", description: "Your post is now live on LinkedIn." });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{draft.topic}</CardTitle>
        <CardDescription>
          Generated on <ClientOnly>{new Date(draft.createdAt).toLocaleDateString()}</ClientOnly> from {draft.source}
        </CardDescription>
        <div className="flex items-center gap-2 pt-2">
            <Badge variant={draft.status === 'posted' ? 'default' : 'secondary'}>{draft.status}</Badge>
            {draft.postedAt && <span className="text-xs text-muted-foreground">Posted on <ClientOnly>{new Date(draft.postedAt).toLocaleDateString()}</ClientOnly></span>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              rows={8}
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Save</Button>
            </div>
          </div>
        ) : (
          <p className="text-sm whitespace-pre-wrap">{draft.optimized_text}</p>
        )}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4" /> AI Analysis & Raw Generation
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                    <ThumbsUp className="h-4 w-4 text-primary" />
                    <span>Engage: {Math.round((draft.optimized_meta.engagement_prediction || 0) * 100)}%</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                    <Sparkles className="h-4 w-4 text-accent" />
                    <span>Tone: {Math.round((draft.optimized_meta.tone_score || 0) * 100)}%</span>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Raw AI Draft</h4>
                <p className="text-xs text-muted-foreground p-3 bg-muted rounded-md whitespace-pre-wrap">{draft.raw_generation}</p>
              </div>
               <div>
                <h4 className="font-semibold mb-2">Tone Adjustments</h4>
                <ul className="list-disc pl-5 text-xs text-muted-foreground">
                    {draft.optimized_meta.tone_adjustments?.map((adj, i) => <li key={i}>{adj}</li>)}
                     {(!draft.optimized_meta.tone_adjustments || draft.optimized_meta.tone_adjustments.length === 0) && <li>No significant adjustments made.</li>}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-4 text-muted-foreground text-sm">
            {draft.status === 'posted' && (
                <>
                    <div className="flex items-center gap-1"><ThumbsUp className="h-4 w-4" /> 128</div>
                    <div className="flex items-center gap-1"><MessageSquare className="h-4 w-4" /> 32</div>
                    <div className="flex items-center gap-1"><Eye className="h-4 w-4" /> 5.6k</div>
                </>
            )}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => copyToClipboard(draft.optimized_text)}>
            <ClipboardCopy className="h-4 w-4" />
          </Button>
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
          )}
          {draft.status !== 'posted' && (
            <Button onClick={handlePost}>
              <Share2 className="mr-2 h-4 w-4" /> Post Now
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

export default function DraftsPage() {
  const { drafts } = useAppContext();

  const statusFilters: DraftPost["status"][] = ["draft", "scheduled", "posted", "failed"];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold">Drafts</h1>
        <Button className="ml-auto">Generate New Post</Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          {statusFilters.map(status => (
              <TabsTrigger key={status} value={status} className="capitalize">{status}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {drafts.map((draft) => (
            <DraftCard key={draft.id} draft={draft} />
          ))}
        </TabsContent>

        {statusFilters.map(status => (
            <TabsContent key={status} value={status} className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {drafts.filter(d => d.status === status).map((draft) => (
                    <DraftCard key={draft.id} draft={draft} />
                ))}
                {drafts.filter(d => d.status === status).length === 0 && (
                    <Card className="col-span-full">
                        <CardContent className="p-6">
                            <p className="text-center text-muted-foreground">No {status} posts found.</p>
                        </CardContent>
                    </Card>
                )}
            </TabsContent>
        ))}

      </Tabs>
    </div>
  );
}
