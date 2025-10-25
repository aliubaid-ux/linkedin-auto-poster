'use client';
import { useFirebase } from '@/firebase/provider';
export const useAuth = () => useFirebase().auth;
