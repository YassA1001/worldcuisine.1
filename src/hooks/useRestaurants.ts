import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Restaurant, RestaurantRating } from '../types/database';
import { useAuth } from '../contexts/AuthContext';

export interface RestaurantWithRating extends Restaurant {
  avgRating: number;
  ratingCount: number;
  userRating?: number;
}

export function useRestaurants(countryCode?: string) {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState<RestaurantWithRating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      let query = supabase.from('restaurants').select('*');
      if (countryCode) query = query.eq('country_code', countryCode);
      const { data: rests } = await query;

      const { data: ratings } = await supabase.from('restaurant_ratings').select('*');

      const enriched: RestaurantWithRating[] = (rests ?? []).map(r => {
        const restRatings = (ratings ?? []).filter((rt: RestaurantRating) => rt.restaurant_id === r.id);
        const avg = restRatings.length
          ? restRatings.reduce((s: number, rt: RestaurantRating) => s + rt.rating, 0) / restRatings.length
          : 0;
        const userRating = user
          ? restRatings.find((rt: RestaurantRating) => rt.user_id === user.id)?.rating
          : undefined;
        return { ...r, avgRating: avg, ratingCount: restRatings.length, userRating };
      });

      setRestaurants(enriched);
      setLoading(false);
    };
    fetch();
  }, [countryCode, user]);

  const rate = async (restaurantId: string, rating: number) => {
    if (!user) return;
    await supabase.from('restaurant_ratings').upsert({
      user_id: user.id,
      restaurant_id: restaurantId,
      rating,
    }, { onConflict: 'user_id,restaurant_id' });
    setRestaurants(prev => prev.map(r => {
      if (r.id !== restaurantId) return r;
      const newCount = r.userRating ? r.ratingCount : r.ratingCount + 1;
      const newAvg = r.userRating
        ? (r.avgRating * r.ratingCount - r.userRating + rating) / r.ratingCount
        : (r.avgRating * r.ratingCount + rating) / newCount;
      return { ...r, avgRating: newAvg, ratingCount: newCount, userRating: rating };
    }));
  };

  return { restaurants, loading, rate };
}
