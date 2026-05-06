import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useFavorites() {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) { setFavoriteIds(new Set()); return; }
    setLoading(true);
    supabase
      .from('favorites')
      .select('dish_id')
      .eq('user_id', user.id)
      .then(({ data }) => {
        setFavoriteIds(new Set((data ?? []).map(f => f.dish_id)));
        setLoading(false);
      });
  }, [user]);

  const toggle = async (dishId: string) => {
    if (!user) return;
    if (favoriteIds.has(dishId)) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('dish_id', dishId);
      setFavoriteIds(prev => { const s = new Set(prev); s.delete(dishId); return s; });
    } else {
      await supabase.from('favorites').insert({ user_id: user.id, dish_id: dishId });
      setFavoriteIds(prev => new Set([...prev, dishId]));
    }
  };

  return { favoriteIds, toggle, loading };
}
