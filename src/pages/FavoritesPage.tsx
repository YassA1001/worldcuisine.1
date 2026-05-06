import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Dish } from '../types/database';
import DishCard from '../components/dishes/DishCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useFavorites } from '../hooks/useFavorites';

export default function FavoritesPage() {
  const { user } = useAuth();
  const { favoriteIds } = useFavorites();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const fetch = async () => {
      setLoading(true);
      const ids = [...favoriteIds];
      if (ids.length === 0) { setDishes([]); setLoading(false); return; }
      const { data } = await supabase.from('dishes').select('*').in('id', ids);
      setDishes(data ?? []);
      setLoading(false);
    };
    fetch();
  }, [user, favoriteIds]);

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 pt-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={24} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Sign in to see your favorites</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Create an account to save dishes you love.</p>
          <Link to="/auth" className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors">
            Sign In
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center">
            <Heart size={22} className="text-rose-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Favorites</h1>
            <p className="text-gray-500 dark:text-gray-400">{dishes.length} saved {dishes.length === 1 ? 'dish' : 'dishes'}</p>
          </div>
        </motion.div>

        {loading ? (
          <LoadingSpinner className="h-48" />
        ) : dishes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={32} className="text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No favorites yet</h3>
            <p className="text-gray-400 dark:text-gray-500 mb-6">Explore dishes and tap the heart icon to save them.</p>
            <Link to="/map" className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors">
              Explore Dishes
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dishes.map((dish, i) => (
              <DishCard key={dish.id} dish={dish} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
