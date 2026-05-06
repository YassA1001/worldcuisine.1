import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, ChefHat, Heart, CheckCircle2 } from 'lucide-react';
import { useDish } from '../hooks/useDishes';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../contexts/AuthContext';
import { getCountryByCode } from '../data/countries';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const DIFFICULTY_COLOR = {
  easy: 'success' as const,
  medium: 'warning' as const,
  hard: 'error' as const,
};

export default function DishPage() {
  const { id } = useParams<{ id: string }>();
  const { dish, loading } = useDish(id ?? '');
  const { favoriteIds, toggle } = useFavorites();
  const { user } = useAuth();
  const isFav = dish ? favoriteIds.has(dish.id) : false;

  if (loading) return <LoadingSpinner className="min-h-screen" />;
  if (!dish) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
      <p className="text-gray-500">Dish not found. <Link to="/map" className="text-orange-500 hover:underline">Go back</Link></p>
    </div>
  );

  const country = getCountryByCode(dish.country_code);
  const formattedTime = dish.prep_time_minutes >= 60
    ? `${Math.floor(dish.prep_time_minutes / 60)}h ${dish.prep_time_minutes % 60 ? `${dish.prep_time_minutes % 60}m` : ''}`
    : `${dish.prep_time_minutes}m`;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-20">
      {/* Hero Image */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute top-4 left-4">
          <Link
            to={`/country/${dish.country_code}`}
            className="flex items-center gap-2 text-white/80 hover:text-white text-sm bg-black/30 backdrop-blur-sm px-3 py-2 rounded-xl transition-colors"
          >
            <ArrowLeft size={14} />
            {dish.country_name}
          </Link>
        </div>
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant={DIFFICULTY_COLOR[dish.difficulty]}>{dish.difficulty}</Badge>
            {dish.tags.map(tag => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">{dish.name}</h1>
        </div>
        {user && (
          <button
            onClick={() => toggle(dish.id)}
            className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg ${
              isFav ? 'bg-rose-500 text-white' : 'bg-white/20 backdrop-blur-md text-white hover:bg-rose-500'
            }`}
          >
            <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-6 mb-8 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Clock size={18} className="text-orange-500" />
            <div>
              <p className="text-xs text-gray-400">Prep time</p>
              <p className="font-semibold">{formattedTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <ChefHat size={18} className="text-orange-500" />
            <div>
              <p className="text-xs text-gray-400">Difficulty</p>
              <p className="font-semibold capitalize">{dish.difficulty}</p>
            </div>
          </div>
          {country && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <span className="text-2xl">{country.flag}</span>
              <div>
                <p className="text-xs text-gray-400">Origin</p>
                <p className="font-semibold">{dish.country_name}</p>
              </div>
            </div>
          )}
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-10">{dish.description}</p>

        <div className="grid md:grid-cols-5 gap-10">
          {/* Ingredients */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {dish.ingredients.map((ing, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-2 text-gray-700 dark:text-gray-300 text-sm"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                  {ing}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="md:col-span-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Instructions</h2>
            <ol className="space-y-4">
              {dish.instructions.map((step, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed pt-1">{step}</p>
                </motion.li>
              ))}
            </ol>
            <div className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
              <CheckCircle2 size={20} className="text-emerald-500" />
              <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">You've got this! Enjoy cooking {dish.name}.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
