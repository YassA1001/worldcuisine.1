import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Dish } from '../types/database';

export function useDishes(countryCode?: string) {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      let query = supabase.from('dishes').select('*').order('name');
      if (countryCode) query = query.eq('country_code', countryCode);
      const { data, error } = await query;
      if (error) setError(error.message);
      else setDishes(data ?? []);
      setLoading(false);
    };
    fetch();
  }, [countryCode]);

  return { dishes, loading, error };
}

export function useDish(id: string) {
  const [dish, setDish] = useState<Dish | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase.from('dishes').select('*').eq('id', id).maybeSingle().then(({ data }) => {
      setDish(data);
      setLoading(false);
    });
  }, [id]);

  return { dish, loading };
}
