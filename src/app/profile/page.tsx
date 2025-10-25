"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppContext } from "@/context/app-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  niches: z.array(z.object({ value: z.string().min(1, "Niche cannot be empty.") })),
  tone: z.string(),
  postingMode: z.enum(["auto", "manual"]),
  preferredTimeUTC: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)."),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { profile, setProfile } = useAppContext();
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      ...profile,
      niches: profile.niches.map(n => ({ value: n }))
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "niches",
    control: form.control,
  });

  function onSubmit(data: ProfileFormValues) {
    const updatedProfile = {
      ...profile,
      ...data,
      niches: data.niches.map(n => n.value),
    };
    setProfile(updatedProfile);
    toast({
      title: "Profile updated",
      description: "Your settings have been saved successfully.",
    });
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-2">
      <h1 className="text-3xl font-semibold">Profile & Settings</h1>
      <p className="text-muted-foreground">Customize your LinkFlow AI experience.</p>
      
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
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Ali Ubaid" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Niches</FormLabel>
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
                              <Input {...field} placeholder="e.g., AI" />
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
                    <FormLabel>Tone of Voice</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
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
                name="postingMode"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Posting Mode</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="manual" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Manual: Review and post drafts yourself.
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="auto" />
                          </FormControl>
                          <FormLabel className="font-normal">
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
                name="preferredTimeUTC"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Posting Time (UTC)</FormLabel>
                    <FormControl>
                      <Input placeholder="10:00" {...field} />
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
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
