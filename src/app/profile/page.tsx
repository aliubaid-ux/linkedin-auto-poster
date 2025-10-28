'use client';

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppContext } from "@/context/app-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Profile } from "@/lib/types";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  niches: z.array(z.object({ value: z.string().min(1, "Niche cannot be empty.") })).optional(),
  tone: z.string(),
  posting_mode: z.enum(["auto", "manual"]),
  preferred_time_utc: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)."),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

function ProfileForm() {
  const { profile, updateProfile } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      niches: [],
      tone: 'Expert + Conversational',
      posting_mode: 'manual',
      preferred_time_utc: '10:00',
    },
  });

  useEffect(() => {
    if (profile) {
        console.log("Profile data:", profile);
      form.reset({
        name: profile.name,
        niches: profile.niches.map(n => ({ value: n })) || [],
        tone: profile.tone,
        posting_mode: profile.posting_mode,
        preferred_time_utc: profile.preferred_time_utc,
      });
    }
  }, [profile, form.reset]);

  const { fields, append, remove } = useFieldArray({
    name: "niches",
    control: form.control,
  });

  async function onSubmit(data: ProfileFormValues) {
    if (!profile) return;
    setIsSubmitting(true);
    const updatedProfileData: Profile = {
      ...profile,
      ...data,
      niches: data.niches ? data.niches.map(n => n.value) : [],
    };
    await updateProfile(updatedProfileData);
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              This information helps personalize the generated content.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name">Display Name</FormLabel>
                  <FormControl>
                    <Input id="name" placeholder="e.g., Ali Ubaid" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel htmlFor="niches">Niches</FormLabel>
              <FormDescription>
                Add tags that define your areas of expertise.
              </FormDescription>
              <div className="space-y-2">
                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`niches.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input {...field} id={`niches.${index}.value`} placeholder="e.g., AI" />
                          </FormControl>
                          <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => append({ value: "" })}
              >
                Add Niche
              </Button>
            </FormItem>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Preferences</CardTitle>
            <CardDescription>
              Define the voice and automation level for your posts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="tone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="tone">Tone of Voice</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger id="tone">
                        <SelectValue placeholder="Select a tone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Expert + Conversational">Expert + Conversational</SelectItem>
                      <SelectItem value="Formal & Authoritative">Formal & Authoritative</SelectItem>
                      <SelectItem value="Friendly & Casual">Friendly & Casual</SelectItem>
                      <SelectItem value="Storyteller">Storyteller</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="posting_mode"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel htmlFor="posting_mode">Posting Mode</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-1"
					  id="posting_mode"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="manual" id="manual"/>
                        </FormControl>
                        <FormLabel htmlFor="manual" className="font-normal">
                          Manual: Review and post drafts yourself.
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="auto" id="auto" />
                        </FormControl>
                        <FormLabel htmlFor="auto" className="font-normal">
                          Auto: Posts are published automatically.
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="preferred_time_utc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="preferred_time_utc">Preferred Posting Time (UTC)</FormLabel>
                  <FormControl>
                    <Input id="preferred_time_utc" placeholder="10:00" {...field} />
                  </FormControl>
                  <FormDescription>
                    The target time for automated posts.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                ) : (
                    "Save Changes"
                )}
            </Button>
        </div>
      </form>
    </Form>
  );
}

export default function ProfilePage() {
  const { loading } = useAppContext();

  if (loading) {
    return (
        <div className="mx-auto grid w-full max-w-6xl gap-2">
            <h1 className="text-3xl font-semibold">Profile & Settings</h1>
            <p className="text-muted-foreground">Customize your LinkFlow AI experience.</p>
            <div className="space-y-8 mt-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>
                            This information helps personalize the generated content.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <Skeleton className="h-10 w-1/2" />
                       <Skeleton className="h-20 w-full" />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Content Preferences</CardTitle>
                         <CardDescription>
                            Define the voice and automation level for your posts.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-10 w-1/2" />
                        <Skeleton className="h-20 w-full" />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-2">
      <h1 className="text-3xl font-semibold">Profile & Settings</h1>
      <p className="text-muted-foreground">Customize your LinkFlow AI experience.</p>
      <ProfileForm />
    </div>
  );
}
