import { useState, useEffect } from 'react';
import { supabase } from '@/supabase/client';

export function useDoc<T>(tableName: string, userId: string | undefined) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!userId || !tableName) return;
      setLoading(true);
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // Ignore no rows found
        console.error('Error fetching document:', error);
        setData(null);
      } else {
        setData(data as T);
      }
      setLoading(false);
    }

    fetchData();

     const channel = supabase.channel(`public:${tableName}`);
    channel
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tableName, filter: `user_id=eq.${userId}` },
        (payload) => {
          fetchData(); // Refetch on changes
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName, userId]);

  return { data, loading };
}
