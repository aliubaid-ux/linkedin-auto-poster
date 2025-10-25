'use client';

import { initializeFirebase } from '@/firebase';
import { FirebaseProvider } from '@/firebase/provider';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { FirebaseApp } from 'firebase/app';
import { ReactNode } from 'react';

let app: FirebaseApp | null = null;
let firestore: Firestore | null = null;
let auth: Auth | null = null;

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  if (!app) {
    const firebase = initializeFirebase();
    app = firebase.app;
    firestore = getFirestore(app);
    auth = getAuth(app);
  }

  return (
    <FirebaseProvider app={app} firestore={firestore} auth={auth}>
      {children}
    </FirebaseProvider>
  );
}
