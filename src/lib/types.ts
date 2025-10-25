export interface Profile {
  name: string;
  niches: string[];
  tone: string;
  postingMode: 'auto' | 'manual';
  preferredTimeUTC: string;
  linkedinConnected: boolean;
}

export interface DraftPost {
  id: string;
  source: string;
  topic: string;
  raw_generation: string;
  optimized_text: string;
  optimized_meta: {
    hooks: string[];
    emotional_score: number;
    engagement_prediction: number;
    tone_score?: number;
    tone_adjustments?: string[];
  };
  status: 'draft' | 'scheduled' | 'posted' | 'failed';
  createdAt: string;
  postedAt: string | null;
  linkedinPostId: string | null;
}

export interface LearnedTone {
  avg_length: number;
  preferred_hooks: string[];
  sentence_complexity: number;
  emojiUsage: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  runId: string;
  status: 'success' | 'partial' | 'failed';
  generatedCount: number;
  postedCount: number;
  errors: string[];
}
