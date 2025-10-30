'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppContext } from "@/context/app-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateLinkedInPost } from "@/ai/flows/generate-linkedin-post";
import { optimizeLinkedInPostForEngagement } from "@/ai/flows/optimize-linkedin-post-for-engagement";
import { adaptPostToneToUserPreferences } from "@/ai/flows/adapt-post-tone-to-user-preferences";
import { useToast } from "@/hooks/use-toast";
import type { DraftPost } from "@/lib/types";
import { Bot, Loader2 } from "lucide-react";

const formSchema = z.object({
  topic: z.string().min(10, { message: "Topic must be at least 10 characters." }),
  niche: z.string().min(1, { message: "Please select a niche." }),
});

export function PostGenerator() {
  const { profile, addDraft, learnedTone, loading } = useAppContext();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { topic: "", niche: "" },
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
      toast({ title: "Generating post...", description: "Your new post is being created by AI." });

      const generationResult = await generateLinkedInPost({ topicSummary: values.topic, niche: values.niche, tone: profile.tone });
      const optimizationResult = await optimizeLinkedInPostForEngagement({ initialDraft: generationResult.linkedinPost });
      const adaptationResult = await adaptPostToneToUserPreferences({ post: optimizationResult.optimizedText, learnedToneJson: JSON.stringify(learnedTone) });

      const newDraft: Omit<DraftPost, 'id' | 'createdAt' | 'user_id'> = {
        source: "manual",
        topic: values.topic,
        raw_generation: generationResult.linkedinPost,
        optimized_text: adaptationResult.finalPost,
        optimized_meta: {
          hooks: optimizationResult.optimizedMeta?.hooks || [],
          emotional_score: optimizationResult.optimizedMeta?.emotionalScore || 0,
          engagement_prediction: optimizationResult.optimizedMeta?.engagementPrediction || 0,
          tone_score: adaptationResult.score,
          tone_adjustments: adaptationResult.adjustments,
        },
        status: "draft",
        postedAt: null,
      };

      await addDraft(newDraft);
      form.reset();
      toast({ title: "Post generated!", description: "Your new draft has been created successfully.", variant: "default" });
    } catch (error) {
      console.error("Error generating post:", error);
      toast({ title: "Error", description: "Failed to generate post. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate New Post</CardTitle>
        <CardDescription>Enter a topic, and let AI craft a post for you.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="niche"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Niche</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading || !profile?.niches || profile.niches.length === 0}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a niche for this post" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {profile?.niches?.map((niche) => (
                        <SelectItem key={niche} value={niche}>
                          {niche}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
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
  );
}
