'use client';

import { createContext, useContext, ReactNode, useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import type { User } from '@supabase/supabase-js';

import type { Profile, DraftPost, LearnedTone, LogEntry } from '@/lib/types';
import { initialProfile, initialLearnedTone } from '@/lib/data';

interface AppContextType {
  profile: Profile | null;
  drafts: DraftPost[];
  learnedTone: LearnedTone | null;
  logs: LogEntry[];
  loading: boolean;
  updateProfile: (profile: Profile) => Promise<void>;
  addDraft: (draft: Omit<DraftPost, 'id' | 'createdAt' | 'user_id'>) => Promise<void>;
  updateDraft: (updatedDraft: DraftPost) => Promise<void>;
  addLog: (log: Omit<LogEntry, 'id' | 'createdAt' | 'user_id'>) => Promise<void>;
  setDrafts: React.Dispatch<React.SetStateAction<DraftPost[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [drafts, setDrafts] = useState<DraftPost[]>([]);
  const [learnedTone, setLearnedTone] = useState<LearnedTone | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const router = useRouter();
  const pathname = usePathname();

  const loadInitialData = useCallback(async (currentUser: User) => {
    try {
      const fetchProfile = supabase.from('profiles').select('*').eq('user_id', currentUser.id).single();
      const fetchDrafts = supabase.from('drafts').select('*').eq('user_id', currentUser.id);
      const fetchLearnedTone = supabase.from('learned_tones').select('*').eq('user_id', currentUser.id).single();
      const fetchLogs = supabase.from('logs').select('*').eq('user_id', currentUser.id);

      const [
          profileResult,
          draftsResult,
          learnedToneResult,
          logsResult
      ] = await Promise.all([
          fetchProfile,
          fetchDrafts,
          fetchLearnedTone,
          fetchLogs
      ]);

      if (profileResult.data) {
        setProfile(profileResult.data);
      } else if (profileResult.error && profileResult.error.code === 'PGRST116') { // No profile found
        const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({ ...initialProfile, user_id: currentUser.id })
            .select()
            .single();
        if (insertError) console.error('Error creating initial profile:', insertError);
        else setProfile(newProfile);
      }

      setDrafts(draftsResult.data || []);

       if (learnedToneResult.data) {
        setLearnedTone(learnedToneResult.data);
      } else if (learnedToneResult.error && learnedToneResult.error.code === 'PGRST116') {
        const { data: newTone, error: insertError } = await supabase
            .from('learned_tones')
            .insert({ ...initialLearnedTone, user_id: currentUser.id })
            .select()
            .single();
        if (insertError) console.error('Error creating initial learned tone:', insertError);
        else setLearnedTone(newTone);
      }

      setLogs(logsResult.data || []);

    } catch (error) {
      console.error("Error loading initial data:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          setLoading(true);
          loadInitialData(currentUser);
        } else {
          setLoading(false);
          setProfile(null);
          setDrafts([]);
          setLearnedTone(null);
          setLogs([]);
          if (pathname !== '/login') {
            router.push('/login');
          }
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [pathname, router, loadInitialData, supabase]);

  useEffect(() => {
    if (user) {
      const channel = supabase.channel('public-changes').on(
        'postgres_changes',
        { event: '*', schema: 'public', filter: `user_id=eq.${user.id}` },
        () => loadInitialData(user)
      ).subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, loadInitialData, supabase]);


  async function updateProfile(newProfile: Profile) {
    if (!user) return;
    const { data, error } = await supabase.from('profiles').upsert({ ...newProfile, user_id: user.id }).select().single();
    if (error) {
      console.error('Error setting profile:', error);
    } else if(data) {
      setProfile(data);
    }
  }

  async function addDraft(draft: Omit<DraftPost, 'id' | 'createdAt' | 'user_id'>) {
    if (!user) return;
    const { data, error } = await supabase.from('drafts').insert({ ...draft, user_id: user.id }).select().single();
    if (error) {
        console.error('Error adding draft:', error);
    } else if (data) {
        setDrafts(prevDrafts => [data, ...prevDrafts]);
    }
  }

  async function updateDraft(updatedDraft: DraftPost) {
    if (!user) return;
    const { error } = await supabase.from('drafts').update(updatedDraft).eq('id', updatedDraft.id);
    if (error) console.error('Error updating draft:', error);
  }

  async function addLog(log: Omit<LogEntry, 'id' | 'createdAt' | 'user_id'>) {
    if (!user) return;
    const { error } = await supabase.from('logs').insert({ ...log, user_id: user.id });
    if (error) console.error('Error adding log:', error);
  }
  
  if (pathname === '/login') {
    return <>{children}</>;
  }

  const value = {
    profile,
    drafts,
    learnedTone,
    logs,
    loading,
    updateProfile,
    addDraft,
    updateDraft,
    addLog,
    setDrafts,
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
