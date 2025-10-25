"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppContext } from "@/context/app-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateLinkedInPost } from "@/ai/flows/generate-linkedin-post";
import { optimizeLinkedInPostForEngagement } from "@/ai/flows/optimize-linkedin-post-for-engagement";
import { adaptPostToneToUserPreferences } from "@/ai/flows/adapt-post-tone-to-user-preferences";
import { useToast } from "@/hooks/use-toast";
import type { DraftPost } from "@/lib/types";
import {
  Bot,
  FileText,
  Loader2,
  Share2,
  PenSquare,
  ClipboardCopy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ClientOnly } from "@/components/client-only";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  topic: z.string().min(10, {
    message: "Topic must be at least 10 characters.",
  }),
});

export default function DashboardPage() {
  const { profile, drafts, addDraft, learnedTone, loading } = useAppContext();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if (!profile || !learnedTone) {
      toast({
        title: "Profile not loaded",
        description: "Please wait for your profile to load before generating posts.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      toast({
        title: "Generating post...",
        description: "Your new post is being created by AI.",
      });

      const generationResult = await generateLinkedInPost({
        topicSummary: values.topic,
        niche: profile.niches.join(", "),
        tone: profile.tone,
      });

      const optimizationResult = await optimizeLinkedInPostForEngagement({
        initialDraft: generationResult.linkedinPost,
      });

      const adaptationResult = await adaptPostToneToUserPreferences({
        post: optimizationResult.optimizedText,
        learnedToneJson: JSON.stringify(learnedTone),
      });

      const newDraft: DraftPost = {
        id: `draft_${Date.now()}`,
        source: "manual",
        topic: values.topic,
        raw_generation: generationResult.linkedinPost,
        optimized_text: adaptationResult.finalPost,
        optimized_meta: {
          hooks: optimizationResult.optimizedMeta?.hooks || [],
          emotional_score:
            optimizationResult.optimizedMeta?.emotionalScore || 0,
          engagement_prediction:
            optimizationResult.optimizedMeta?.engagementPrediction || 0,
          tone_score: adaptationResult.score,
          tone_adjustments: adaptationResult.adjustments,
        },
        status: "draft",
        createdAt: new Date().toISOString(),
        postedAt: null,
        linkedinPostId: null,
      };

      addDraft(newDraft);
      form.reset();
      toast({
        title: "Post generated!",
        description: "Your new draft has been created successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error generating post:", error);
      toast({
        title: "Error",
        description: "Failed to generate post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const stats = {
    total: drafts.length,
    posted: drafts.filter((d) => d.status === "posted").length,
    drafts: drafts.filter((d) => d.status === "draft").length,
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  if (loading) {
    return (
        <div className="grid flex-1 items-start gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <Card><CardHeader><Skeleton className="h-12 w-24" /></CardHeader></Card>
              <Card><CardHeader><Skeleton className="h-12 w-24" /></CardHeader></Card>
              <Card><CardHeader><Skeleton className="h-12 w-24" /></CardHeader></Card>
              <Card><CardHeader><Skeleton className="h-12 w-24" /></CardHeader></Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Generate New Post</CardTitle>
                <CardDescription>
                  Enter a trending topic, news headline, or a simple idea to
                  generate a new LinkedIn post.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-full mt-4" />
              </CardContent>
            </Card>
          </div>
           <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
             <Card>
               <CardHeader><CardTitle>Recent Drafts</CardTitle></CardHeader>
               <CardContent className="space-y-4">
                  <div className="space-y-2"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-1/2" /></div>
                  <Separator/>
                  <div className="space-y-2"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-1/2" /></div>
               </CardContent>
             </Card>
           </div>
        </div>
      )
  }

  return (
    <div className="grid flex-1 items-start gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Posts</CardDescription>
              <CardTitle className="text-4xl">{stats.total}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                All posts generated
              </div>
            </CardContent>
            <CardFooter>
              <FileText className="text-muted-foreground" />
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Posted</CardDescription>
              <CardTitle className="text-4xl">{stats.posted}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                Published to LinkedIn
              </div>
            </CardContent>
            <CardFooter>
              <Share2 className="text-muted-foreground" />
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Drafts</CardDescription>
              <CardTitle className="text-4xl">{stats.drafts}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                Waiting for review
              </div>
            </CardContent>
            <CardFooter>
              <PenSquare className="text-muted-foreground" />
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>AI Credits</CardDescription>
              <CardTitle className="text-4xl">~2.1k</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                Remaining for this cycle
              </div>
            </CardContent>
            <CardFooter>
              <Bot className="text-muted-foreground" />
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Generate New Post</CardTitle>
            <CardDescription>
              Enter a trending topic, news headline, or a simple idea to
              generate a new LinkedIn post.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic / Idea</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 'The future of AI in web design...'"
                          {...field}
                          rows={3}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading || loading} className="w-full">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Bot className="mr-2 h-4 w-4" />
                  )}
                  Generate with AI
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Recent Drafts</CardTitle>
            <CardDescription>
              Your latest generated posts. Review and edit before posting.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {drafts.slice(0, 3).map((draft) => (
              <div key={draft.id} className="space-y-2">
                <div className="space-y-1">
                  <p className="font-medium leading-none">{draft.topic}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {draft.optimized_text}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                   <Badge variant={draft.status === 'posted' ? 'default' : 'secondary'}>{draft.status}</Badge>
                  <span className="text-xs text-muted-foreground">
                    <ClientOnly>{new Date(draft.createdAt).toLocaleDateString()}</ClientOnly>
                  </span>
                  <Button variant="ghost" size="icon" className="ml-auto h-7 w-7" onClick={() => copyToClipboard(draft.optimized_text)}>
                    <ClipboardCopy className="h-4 w-4" />
                  </Button>
                </div>
                <Separator />
              </div>
            ))}
             {drafts.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No drafts yet. Generate one above!</p>
              )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
