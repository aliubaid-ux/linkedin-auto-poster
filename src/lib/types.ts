export interface Profile {
  name: string;
  niches: string[];
  tone: string;
  posting_mode: 'auto' | 'manual';
  preferred_time_utc: string;
  linkedin_connected: boolean;
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
  created_at: string;
  posted_at: string | null;
  linkedin_post_id: string | null;
}

export interface LearnedTone {
  avg_length: number;
  preferred_hooks: string[];
  sentence_complexity: number;
  emoji_usage: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  run_id: string;
  status: 'success' | 'partial' | 'failed';
  generated_count: number;
  posted_count: number;
  errors: string[];
}
