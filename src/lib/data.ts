import type { Profile, DraftPost, LearnedTone, LogEntry } from './types';

export const initialProfile: Profile = {
  name: 'Ali Ubaid',
  niches: ['AI', 'SEO', 'Web Design'],
  tone: 'Expert + Conversational',
  postingMode: 'manual',
  preferredTimeUTC: '10:00',
  linkedinConnected: false,
};

export const initialDrafts: DraftPost[] = [
  {
    id: 'draft_1',
    source: 'reddit',
    topic: 'Vercel Ship keynote takeaways for modern web developers',
    raw_generation: 'Vercel just had their Ship event. They announced new features for Next.js and their platform. This is important for web developers. You should check it out.',
    optimized_text: `Did you catch the Vercel Ship keynote? 🚀 My top takeaway: the line between frontend and backend is officially blurred. With AI integrations and improved serverless functions, building full-stack apps on the edge has never been more seamless. I remember wrestling with server configurations just a few years ago - what a change! What feature are you most excited to try? #VercelShip #NextJS #WebDev`,
    optimized_meta: {
      hooks: ['question', 'story'],
      emotional_score: 0.75,
      engagement_prediction: 0.8,
      tone_score: 0.9,
      tone_adjustments: ['Added personal anecdote', 'Included relevant hashtags'],
    },
    status: 'draft',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    postedAt: null,
    linkedinPostId: null,
  },
  {
    id: 'draft_2',
    source: 'hacker-news',
    topic: 'The surprising power of boredom in creative work',
    raw_generation: 'Being bored can be good for creativity. When you are bored, your mind wanders. This can lead to new ideas. Embrace boredom.',
    optimized_text: `I used to think every minute had to be productive. Now? I schedule 'boredom breaks'. It's where my best ideas come from. That 'aha!' moment for my last project didn't come from a brainstorm, but from staring out a window. It seems our brains do their best work when we're not actively 'working'. Have you ever found a great idea in a moment of idleness? #Creativity #Productivity #Mindfulness`,
    optimized_meta: {
      hooks: ['question', 'story'],
      emotional_score: 0.85,
      engagement_prediction: 0.78,
      tone_score: 0.92,
      tone_adjustments: ['Shifted to first-person narrative', 'Made the CTA more personal'],
    },
    status: 'posted',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
    postedAt: new Date(Date.now() - 86400000).toISOString(),
    linkedinPostId: 'urn:li:share:123456789',
  },
];

export const initialLearnedTone: LearnedTone = {
  avg_length: 850,
  preferred_hooks: ['question', 'stat', 'story'],
  sentence_complexity: 1.2,
  emojiUsage: 0.12,
};

export const initialLogs: LogEntry[] = [
    {
        id: 'log_1',
        timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
        runId: 'run_abc123',
        status: 'success',
        generatedCount: 3,
        postedCount: 1,
        errors: [],
    },
    {
        id: 'log_2',
        timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
        runId: 'run_def456',
        status: 'partial',
        generatedCount: 2,
        postedCount: 0,
        errors: ['LinkedIn API token expired'],
    }
];
