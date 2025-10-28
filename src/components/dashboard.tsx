'use client';

import { PostGenerator } from '@/components/post-generator';
import { StatsCards } from '@/components/stats-cards';
import { ActivityFeed } from '@/components/activity-feed';

export default function Dashboard() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="space-y-4">
        <StatsCards />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="lg:col-span-4">
            <PostGenerator />
          </div>
          <div className="lg:col-span-3">
             <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
}
