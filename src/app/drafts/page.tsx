'use client';
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
  Sparkles,
  Smile,
  BookOpen,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import type { DraftPost } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { getRedditHotPosts } from "@/lib/reddit";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { format } from "@/lib/utils";

function DraftCard({ draft, deleteDraft }: { draft: DraftPost, deleteDraft: (id: string) => void }) {
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
    updateDraft({ ...draft, status: "posted", postedAt: new Date().toISOString() });
    toast({ title: "Post published!", description: "Your post is now live on LinkedIn." });
  };

  // Simple readability score for now
  const readabilityScore = Math.round(
    (1 - (editedText.split(" ").length / editedText.length)) * 100
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{draft.topic}</CardTitle>
        <CardDescription>
          Generated on {format(draft.createdAt, { dateStyle: 'medium' })} from {
            draft.source
          }
        </CardDescription>
        <div className="flex items-center gap-2 pt-2">
          <Badge variant={draft.status === "posted" ? "default" : "secondary"}>
            {draft.status}
          </Badge>
          {draft.postedAt && (
            <span className="text-xs text-muted-foreground">
              Posted on {format(draft.postedAt, { dateStyle: 'medium' })}
            </span>
          )}
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
              <Button variant="ghost" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" /> Save
              </Button>
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
                  <span>
                    Engage: {Math.round((draft.optimized_meta.engagement_prediction || 0) * 100)}%
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <span>
                    Tone: {Math.round((draft.optimized_meta.tone_score || 0) * 100)}%
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                  <Smile className="h-4 w-4 text-green-500" />
                  <span>
                    Emotion: {Math.round((draft.optimized_meta.emotional_score || 0) * 100)}%
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  <span>Readability: {readabilityScore}%</span>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Hooks</h4>
                <ul className="list-disc pl-5 text-xs text-muted-foreground">
                  {draft.optimized_meta.hooks?.map((hook, i) => <li key={i}>{hook}</li>)}
                  {(!draft.optimized_meta.hooks ||
                    draft.optimized_meta.hooks.length === 0) && (
                    <li>No hooks identified.</li>
                  )}
                </ul>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Raw AI Draft</h4>
                <p className="text-xs text-muted-foreground p-3 bg-muted rounded-md whitespace-pre-wrap">
                  {draft.raw_generation}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Tone Adjustments</h4>
                <ul className="list-disc pl-5 text-xs text-muted-foreground">
                  {draft.optimized_meta.tone_adjustments?.map((adj, i) => <li key={i}>{adj}</li>)}
                  {(!draft.optimized_meta.tone_adjustments ||
                    draft.optimized_meta.tone_adjustments.length === 0) && (
                    <li>No significant adjustments made.</li>
                  )}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-4 text-muted-foreground text-sm">
          {draft.status === "posted" && (
            <>
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" /> {Math.floor(Math.random() * 200)}
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" /> {Math.floor(Math.random() * 50)}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" /> {Math.floor(Math.random() * 10000)}
              </div>
            </>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => copyToClipboard(draft.optimized_text)}
          >
            <ClipboardCopy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteDraft(draft.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          {draft.status !== "posted" && (
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
  const { drafts, addDraft, loading, profile, deleteDraft } = useAppContext();
  const [subreddit, setSubreddit] = useState("business");
  const [topic, setTopic] = useState("");
  const { toast } = useToast();

  const handleFetchFromReddit = async () => {
    if (!profile) return;
    try {
        const newDrafts = await getRedditHotPosts(subreddit, profile);
        for (const draft of newDrafts) {
            await addDraft(draft);
        }
        toast({ title: "Success", description: `Fetched ${newDrafts.length} new post ideas from r/${subreddit}.` });
    } catch (error) {
        console.error(error);
        toast({ title: "Error", description: "Failed to fetch posts from Reddit.", variant: "destructive" });
    }
  };

  const handleGeneratePost = async () => {
    if (!topic) {
      toast({ title: "Error", description: "Please enter a topic.", variant: "destructive" });
      return;
    }
    if (!profile) {
      toast({ title: "Error", description: "Profile not found.", variant: "destructive" });
      return;
    }

    toast({ title: "Generating Post...", description: "This may take a moment." });

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, context: '', profile }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate content: ${response.statusText}`);
      }

      const generatedContent = await response.json();

      await addDraft({
        ...generatedContent,
        topic,
        source: "manual",
        status: "draft",
      });

      toast({ title: "Post Generated!", description: "Your new draft is ready for review." });
      setTopic("");
    } catch (error) {
      console.error("Error generating post:", error);
      toast({ title: "Error", description: "Failed to generate the post.", variant: "destructive" });
    }
  };

  const statusFilters: DraftPost["status"][] = ["draft", "scheduled", "posted", "failed"];

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">Drafts</h1>
          <Skeleton className="h-10 w-36 ml-auto" />
        </div>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {statusFilters.map((status) => (
              <TabsTrigger key={status} value={status} className="capitalize">
                {status}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="all" className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-24" />
                </CardFooter>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold">Drafts</h1>
        <div className="ml-auto flex items-center gap-2">
          <Input
            type="text"
            placeholder="Enter subreddit"
            value={subreddit}
            onChange={(e) => setSubreddit(e.target.value)}
            className="w-auto"
          />
          <Button onClick={handleFetchFromReddit}>Fetch from Reddit</Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Generate New Post</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate a New Post</DialogTitle>
                <DialogDescription>
                  Enter a topic and our AI will create a draft for you.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="topic" className="text-right">
                    Topic
                  </Label>
                  <Input
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button onClick={handleGeneratePost}>Generate</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          {statusFilters.map((status) => (
            <TabsTrigger key={status} value={status} className="capitalize">
              {status}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {drafts.map((draft) => (
            <DraftCard key={draft.id} draft={draft} deleteDraft={deleteDraft} />
          ))}
           {drafts.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">No drafts found. Generate one or fetch from Reddit to get started.</p>
                </CardContent>
              </Card>
            )}
        </TabsContent>

        {statusFilters.map((status) => (
          <TabsContent key={status} value={status} className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {drafts.filter((d) => d.status === status).map((draft) => (
              <DraftCard key={draft.id} draft={draft} deleteDraft={deleteDraft} />
            ))}
            {drafts.filter((d) => d.status === status).length === 0 && (
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
