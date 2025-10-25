"use client";

import { createContext, useContext, ReactNode, useEffect } from 'react';
import { signInAnonymously } from 'firebase/auth';

import { useUser } from '@/firebase/auth/use-user';
import { useAuth } from '@/firebase/auth/use-auth';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useDoc } from '@/firebase/firestore/use-doc';

import type { Profile, DraftPost, LearnedTone, LogEntry } from '@/lib/types';
import { initialProfile, initialLearnedTone, initialLogs } from '@/lib/data';

interface AppContextType {
  profile: Profile | null;
  drafts: DraftPost[];
  learnedTone: LearnedTone | null;
  logs: LogEntry[];
  loading: boolean;
  // Dummy functions for now, will be implemented with firestore writes
  setProfile: (profile: Profile) => void;
  addDraft: (draft: DraftPost) => void;
  updateDraft: (updatedDraft: DraftPost) => void;
  addLog: (log: LogEntry) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const { user, loading: userLoading } = useUser();

  useEffect(() => {
    if (!user && auth) {
      signInAnonymously(auth).catch((error) => {
        console.error("Anonymous sign-in error:", error);
      });
    }
  }, [user, auth]);

  const userId = user?.uid;

  const { data: profileData, loading: profileLoading } = useDoc<Profile>(
    userId ? `/users/${userId}` : ''
  );
  const { data: draftsData, loading: draftsLoading } = useCollection<DraftPost>(
    userId ? `/users/${userId}/drafts` : ''
  );
  const { data: learnedToneData, loading: learnedToneLoading } = useDoc<LearnedTone>(
     userId ? `/users/${userId}/learnedTone/default` : ''
  );
  const { data: logsData, loading: logsLoading } = useCollection<LogEntry>(
     userId ? `/users/${userId}/logs` : ''
  );
  
  // Dummy functions, to be replaced
  const setProfile = (profile: Profile) => console.log("setProfile", profile);
  const addDraft = (draft: DraftPost) => console.log("addDraft", draft);
  const updateDraft = (updatedDraft: DraftPost) => console.log("updateDraft", updatedDraft);
  const addLog = (log: LogEntry) => console.log("addLog", log);

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
