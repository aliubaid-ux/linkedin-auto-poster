'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/context/app-provider";
import { FileText, Share2, PenSquare, Bot, Loader2 } from "lucide-react";

export function StatsCards() {
  const { drafts, loading } = useAppContext();

  const totalPosts = drafts.length;
  const postedCount = drafts.filter((p) => p.status === 'posted').length;
  const draftsCount = totalPosts - postedCount;

  const stats = [
    { title: "Total Posts", value: totalPosts, icon: FileText },
    { title: "Posted", value: postedCount, icon: Share2 },
    { title: "Drafts", value: draftsCount, icon: PenSquare },
    { title: "AI Credits", value: "~2.1k", icon: Bot },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
              <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">...</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
