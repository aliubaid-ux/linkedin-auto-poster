'use client';

import { createContext, useContext, ReactNode, useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/supabase/client';
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [drafts, setDrafts] = useState<DraftPost[]>([]);
  const [learnedTone, setLearnedTone] = useState<LearnedTone | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

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

      setProfile(profileResult.data || initialProfile);
      setDrafts(draftsResult.data || []);
      setLearnedTone(learnedToneResult.data || initialLearnedTone);
      setLogs(logsResult.data || []);
    } catch (error) {
      console.error("Error loading initial data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

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
  }, [pathname, router, loadInitialData]);

  useEffect(() => {
    if (user) {
      const draftsChannel = supabase.channel('public:drafts').on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'drafts', filter: `user_id=eq.${user.id}` },
        () => loadInitialData(user)
      ).subscribe();

      const profilesChannel = supabase.channel('public:profiles').on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles', filter: `user_id=eq.${user.id}` },
        () => loadInitialData(user)
      ).subscribe();

      const tonesChannel = supabase.channel('public:learned_tones').on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'learned_tones', filter: `user_id=eq.${user.id}` },
        () => loadInitialData(user)
      ).subscribe();

      const logsChannel = supabase.channel('public:logs').on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'logs', filter: `user_id=eq.${user.id}` },
        () => loadInitialData(user)
      ).subscribe();

      return () => {
        supabase.removeChannel(draftsChannel);
        supabase.removeChannel(profilesChannel);
        supabase.removeChannel(tonesChannel);
        supabase.removeChannel(logsChannel);
      };
    }
  }, [user, loadInitialData]);

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
    const { error } = await supabase.from('drafts').insert({ ...draft, user_id: user.id });
    if (error) console.error('Error adding draft:', error);
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
