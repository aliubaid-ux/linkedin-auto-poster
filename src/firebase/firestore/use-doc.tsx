'use client';
import { useState, useEffect, useMemo } from 'react';
import {
  doc,
  onSnapshot,
  DocumentReference,
  DocumentData,
  FirestoreError,
  DocumentSnapshot,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

interface UseDocOptions {
  deps?: any[];
}

export function useDoc<T = DocumentData>(
  path: string,
  options?: UseDocOptions
) {
  const firestore = useFirestore();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  const deps = options?.deps || [];

  const memoizedRef = useMemo(() => {
    if (!firestore || !path) return null;
    // Simple path validation
    const pathSegments = path.split('/').filter(Boolean);
    if (pathSegments.length % 2 !== 0) {
      // This is a collection path, not a doc path. Silently fail.
      return null;
    }
    return doc(firestore, path) as DocumentReference<T>;
  }, [firestore, path, ...deps]);


  useEffect(() => {
    if (!memoizedRef) {
      if(firestore || !path){
          setLoading(false);
      }
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      memoizedRef,
      (snapshot: DocumentSnapshot<T>) => {
        if (snapshot.exists()) {
          setData({ ...snapshot.data(), id: snapshot.id });
        } else {
          setData(null);
        }
        setLoading(false);
        setError(null);
      },
      (err: FirestoreError) => {
        const permissionError = new FirestorePermissionError(
          {
            path: memoizedRef.path,
            operation: 'get',
          },
          err
        );
        errorEmitter.emit('permission-error', permissionError);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [memoizedRef, firestore, path]);

  return { data, loading, error };
}
