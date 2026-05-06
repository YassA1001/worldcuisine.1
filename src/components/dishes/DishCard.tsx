import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Clock, ChefHat } from 'lucide-react';
import type { Dish } from '../../types/database';
import { useFavorites } from '../../hooks/useFavorites';
import { useAuth } from '../../contexts/AuthContext';
import Badge from '../ui/Badge';

interface DishCardProps {
  dish: Dish;
  index?: number;
}

const DIFFICULTY_COLOR = {
  easy: 'success' as const,
  medium: 'warning' as const,
  hard: 'error' as const,
};

export default function DishCard({ dish, index = 0 }: DishCardProps) {
  const { favoriteIds, toggle } = useFavorites();
  const { user } = useAuth();
  const isFav = favoriteIds.has(dish.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
    >
      <Link to={`/dish/${dish.id}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <img
            src={dish.image_url}
            alt={dish.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3 left-3">
            <Badge variant={DIFFICULTY_COLOR[dish.difficulty]}>
              {dish.difficulty}
            </Badge>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-1 group-hover:text-orange-500 transition-colors line-clamp-1">
            {dish.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
            {dish.description}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{dish.prep_time_minutes >= 60 ? `${Math.floor(dish.prep_time_minutes/60)}h ${dish.prep_time_minutes%60 ? dish.prep_time_minutes%60+'m' : ''}` : `${dish.prep_time_minutes}m`}</span>
            </div>
            <div className="flex items-center gap-1">
              <ChefHat size={12} />
              <span>{dish.country_name}</span>
            </div>
          </div>
        </div>
      </Link>

      {user && (
        <button
          onClick={(e) => { e.preventDefault(); toggle(dish.id); }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            isFav
              ? 'bg-rose-500 text-white shadow-lg'
              : 'bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 hover:bg-rose-50 hover:text-rose-500 shadow-sm'
          }`}
        >
          <Heart size={15} fill={isFav ? 'currentColor' : 'none'} />
        </button>
      )}
    </motion.div>
  );
}
