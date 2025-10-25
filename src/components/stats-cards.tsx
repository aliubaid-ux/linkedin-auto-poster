'use client';

import { Card, CardHeader, CardDescription, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { FileText, Share2, PenSquare, Bot } from "lucide-react";

interface StatsCardsProps {
  total: number;
  posted: number;
  drafts: number;
}

export function StatsCards({ total, posted, drafts }: StatsCardsProps) {
  const stats = [
    { title: "Total Posts", value: total, icon: FileText, description: "All posts generated" },
    { title: "Posted", value: posted, icon: Share2, description: "Published to LinkedIn" },
    { title: "Drafts", value: drafts, icon: PenSquare, description: "Waiting for review" },
    { title: "AI Credits", value: "~2.1k", icon: Bot, description: "Remaining for this cycle" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardDescription>{stat.title}</CardDescription>
            <CardTitle className="text-4xl">{stat.value}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">{stat.description}</div>
          </CardContent>
          <CardFooter>
            <stat.icon className="text-muted-foreground" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
