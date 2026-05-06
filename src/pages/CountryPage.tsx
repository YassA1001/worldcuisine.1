import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, MapPin, Filter } from 'lucide-react';
import { getCountryByCode } from '../data/countries';
import { useDishes } from '../hooks/useDishes';
import { useRestaurants } from '../hooks/useRestaurants';
import DishCard from '../components/dishes/DishCard';
import StarRating from '../components/ui/StarRating';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';

type DifficultyFilter = 'all' | 'easy' | 'medium' | 'hard';

export default function CountryPage() {
  const { code } = useParams<{ code: string }>();
  const country = getCountryByCode(code ?? '');
  const { dishes, loading: dishesLoading } = useDishes(code);
  const { restaurants, loading: restsLoading, rate } = useRestaurants(code);
  const { user } = useAuth();

  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all');

  if (!country) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Country not found.</p>
          <Link to="/map" className="text-orange-500 hover:underline mt-2 block">Back to map</Link>
        </div>
      </div>
    );
  }

  const filteredDishes = dishes.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchDiff = difficulty === 'all' || d.difficulty === difficulty;
    return matchSearch && matchDiff;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-20">
      {/* Header */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={`https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg`}
          alt={country.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 max-w-7xl mx-auto">
          <Link to="/map" className="flex items-center gap-2 text-white/70 hover:text-white text-sm mb-3 w-fit transition-colors">
            <ArrowLeft size={16} />
            Back to Map
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{country.flag}</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">{country.name}</h1>
              <p className="text-white/70 mt-1">{country.region}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-3xl mb-10"
        >
          {country.description}
        </motion.p>

        {/* Dishes Section */}
        <section className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Traditional Dishes
              <span className="text-base font-normal text-gray-400 ml-2">({filteredDishes.length})</span>
            </h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search dishes…"
                  className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div className="relative">
                <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value as DifficultyFilter)}
                  className="pl-9 pr-8 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400 appearance-none cursor-pointer"
                >
                  <option value="all">All levels</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
          </div>

          {dishesLoading ? (
            <LoadingSpinner className="h-32" />
          ) : filteredDishes.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No dishes found for your search.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDishes.map((dish, i) => (
                <DishCard key={dish.id} dish={dish} index={i} />
              ))}
            </div>
          )}
        </section>

        {/* Restaurants Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <MapPin size={22} className="text-orange-500" />
            Restaurants
          </h2>

          {restsLoading ? (
            <LoadingSpinner className="h-32" />
          ) : restaurants.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No restaurants listed for this country yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((rest, i) => (
                <motion.div
                  key={rest.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="h-40 overflow-hidden">
                    <img
                      src={rest.image_url || 'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg'}
                      alt={rest.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{rest.name}</h3>
                      <span className="text-sm text-gray-400 font-medium ml-2">{rest.price_range}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{rest.cuisine} Cuisine</p>
                    <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                      <MapPin size={11} />
                      {rest.address}
                    </p>
                    <div className="flex items-center justify-between">
                      <StarRating value={Math.round(rest.avgRating)} count={rest.ratingCount} size="sm" />
                      {user && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-400 mr-1">Rate:</span>
                          <StarRating
                            value={rest.userRating ?? 0}
                            interactive
                            onRate={r => rate(rest.id, r)}
                            size="sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
