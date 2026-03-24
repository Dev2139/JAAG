import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export const useDatabase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const query = async (table: string, options?: any) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from(table).select('*');
      
      if (options) {
        if (options.filters) {
          for (const [column, value] of Object.entries(options.filters)) {
            query = query.eq(column, value);
          }
        }
        if (options.limit) {
          query = query.limit(options.limit);
        }
        if (options.order) {
          query = query.order(options.order.column, {
            ascending: options.order.ascending ?? true,
          });
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (err) {
      const dbError = err as Error;
      setError(dbError);
      throw dbError;
    } finally {
      setLoading(false);
    }
  };

  const insert = async (table: string, data: any) => {
    setLoading(true);
    setError(null);
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert([data])
        .select();
      if (error) throw error;
      return result;
    } catch (err) {
      const dbError = err as Error;
      setError(dbError);
      throw dbError;
    } finally {
      setLoading(false);
    }
  };

  const update = async (table: string, id: string, data: any) => {
    setLoading(true);
    setError(null);
    try {
      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select();
      if (error) throw error;
      return result;
    } catch (err) {
      const dbError = err as Error;
      setError(dbError);
      throw dbError;
    } finally {
      setLoading(false);
    }
  };

  const delete_ = async (table: string, id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      if (error) throw error;
    } catch (err) {
      const dbError = err as Error;
      setError(dbError);
      throw dbError;
    } finally {
      setLoading(false);
    }
  };

  return {
    query,
    insert,
    update,
    delete: delete_,
    loading,
    error,
  };
};
