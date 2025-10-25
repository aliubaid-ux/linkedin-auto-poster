'use client';

import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useSupabaseUser } from '@/supabase/use-user';
import { useCollection } from '@/supabase/use-collection';
import { useDoc } from '@/supabase/use-doc';
import { supabase } from '@/supabase/client';

import type { Profile, DraftPost, LearnedTone, LogEntry } from '@/lib/types';
import { initialProfile, initialLearnedTone, initialLogs } from '@/lib/data';

interface AppContextType {
  profile: Profile | null;
  drafts: DraftPost[];
  learnedTone: LearnedTone | null;
  logs: LogEntry[];
  loading: boolean;
  setProfile: (profile: Profile) => Promise<void>;
  addDraft: (draft: Omit<DraftPost, 'id' | 'createdAt' | 'user_id'>) => Promise<void>;
  updateDraft: (updatedDraft: DraftPost) => Promise<void>;
  addLog: (log: Omit<LogEntry, 'id' | 'createdAt' | 'user_id'>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user, loading: userLoading } = useSupabaseUser();
  const userId = user?.id;

  const { data: profileData, loading: profileLoading } = useDoc<Profile>(
    'profiles', 
    userId
  );
  const { data: draftsData, loading: draftsLoading } = useCollection<DraftPost>(
    'drafts', 
    userId
  );
  const { data: learnedToneData, loading: learnedToneLoading } = useDoc<LearnedTone>(
    'learned_tones',
    userId
  );
  const { data: logsData, loading: logsLoading } = useCollection<LogEntry>(
    'logs', 
    userId
  );

  async function setProfile(profile: Profile) {
    if (!userId) return;
    const { error } = await supabase.from('profiles').upsert({ ...profile, user_id: userId });
    if (error) console.error('Error setting profile:', error);
  }

  async function addDraft(draft: Omit<DraftPost, 'id' | 'createdAt' | 'user_id'>) {
    if (!userId) return;
    const { error } = await supabase.from('drafts').insert({ ...draft, user_id: userId });
    if (error) console.error('Error adding draft:', error);
  }

  async function updateDraft(updatedDraft: DraftPost) {
    if (!userId) return;
    const { error } = await supabase.from('drafts').update(updatedDraft).eq('id', updatedDraft.id);
    if (error) console.error('Error updating draft:', error);
  }

  async function addLog(log: Omit<LogEntry, 'id' | 'createdAt' | 'user_id'>) {
    if (!userId) return;
    const { error } = await supabase.from('logs').insert({ ...log, user_id: userId });
    if (error) console.error('Error adding log:', error);
  }

  const value = {
    profile: profileData || initialProfile,
    drafts: draftsData || [],
    learnedTone: learnedToneData || initialLearnedTone,
    logs: logsData || [],
    loading: userLoading || profileLoading || draftsLoading || learnedToneLoading || logsLoading,
    setProfile,
    addDraft,
    updateDraft,
    addLog,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
