'use client';

import { useAppContext } from "@/context/app-provider";
import { StatsCards } from "@/components/stats-cards";
import { PostGenerator } from "@/components/post-generator";
import { ActivityFeed } from "@/components/activity-feed";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { drafts, loading } = useAppContext();

  const stats = {
    total: drafts.length,
    posted: drafts.filter((d) => d.status === "posted").length,
    drafts: drafts.filter((d) => d.status === "draft").length,
  };

  if (loading) {
    return (
      <div className="grid flex-1 items-start gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
          </div>
          <Skeleton className="h-64" />
        </div>
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid flex-1 items-start gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <StatsCards total={stats.total} posted={stats.posted} drafts={stats.drafts} />
        <PostGenerator />
      </div>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
        <ActivityFeed drafts={drafts} />
      </div>
    </div>
  );
}
