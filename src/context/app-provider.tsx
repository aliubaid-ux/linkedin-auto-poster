"use client";

import { createContext, useContext, ReactNode } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import type { Profile, DraftPost, LearnedTone, LogEntry } from '@/lib/types';
import { initialProfile, initialDrafts, initialLearnedTone, initialLogs } from '@/lib/data';

interface AppContextType {
  profile: Profile;
  setProfile: (profile: Profile) => void;
  drafts: DraftPost[];
  setDrafts: (drafts: DraftPost[]) => void;
  addDraft: (draft: DraftPost) => void;
  updateDraft: (updatedDraft: DraftPost) => void;
  learnedTone: LearnedTone;
  setLearnedTone: (tone: LearnedTone) => void;
  logs: LogEntry[];
  setLogs: (logs: LogEntry[]) => void;
  addLog: (log: LogEntry) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useLocalStorage<Profile>('linkflow-profile', initialProfile);
  const [drafts, setDrafts] = useLocalStorage<DraftPost[]>('linkflow-drafts', initialDrafts);
  const [learnedTone, setLearnedTone] = useLocalStorage<LearnedTone>('linkflow-learned-tone', initialLearnedTone);
  const [logs, setLogs] = useLocalStorage<LogEntry[]>('linkflow-logs', initialLogs);

  const addDraft = (draft: DraftPost) => {
    setDrafts([draft, ...drafts]);
  };

  const updateDraft = (updatedDraft: DraftPost) => {
    setDrafts(drafts.map(d => d.id === updatedDraft.id ? updatedDraft : d));
  };
  
  const addLog = (log: LogEntry) => {
    setLogs([log, ...logs]);
  };

  const value = {
    profile,
    setProfile,
    drafts,
    setDrafts,
    addDraft,
    updateDraft,
    learnedTone,
    setLearnedTone,
    logs,
    setLogs,
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
