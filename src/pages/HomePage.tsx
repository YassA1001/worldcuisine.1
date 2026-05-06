import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, ChefHat, Users, ArrowRight, Search, Star } from 'lucide-react';
import WorldMap from '../components/map/WorldMap';
import { COUNTRIES } from '../data/countries';
import { useDishes } from '../hooks/useDishes';
import DishCard from '../components/dishes/DishCard';

export default function HomePage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const { dishes } = useDishes();
  const featured = dishes.slice(0, 6);

  const scrollToMap = () => mapRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
            alt="World cuisine"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6 text-white/90 text-sm">
              <Globe size={14} className="text-orange-400" />
              <span>Explore {COUNTRIES.length} cuisines from around the world</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
              Discover<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400">
                World Cuisine
              </span>
            </h1>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              Explore authentic recipes, find local restaurants, and share your culinary adventures with food lovers worldwide.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={scrollToMap}
                className="flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-orange-500/30 transition-all duration-200 hover:scale-105"
              >
                <Globe size={18} />
                Explore the Map
              </button>
              <Link
                to="/community"
                className="flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold rounded-2xl transition-all duration-200"
              >
                <Users size={18} />
                Community
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex items-center justify-center gap-8 mt-16"
          >
            {[
              { label: 'Countries', value: `${COUNTRIES.length}+` },
              { label: 'Dishes', value: '20+' },
              { label: 'Restaurants', value: '20+' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-white/60 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Map Section */}
      <section ref={mapRef} className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Interactive World Map
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Click on any highlighted country to explore its traditional dishes and find local restaurants.
            </p>
          </motion.div>
          <WorldMap />
        </div>
      </section>

      {/* Country Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Browse by Country</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Click a country to see its dishes</p>
            </div>
            <Link to="/map" className="flex items-center gap-1.5 text-orange-500 hover:text-orange-600 font-medium text-sm">
              View all <ArrowRight size={14} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {COUNTRIES.map((country, i) => (
              <motion.div
                key={country.code}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  to={`/country/${country.code}`}
                  className="group flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-lg transition-all text-center"
                >
                  <span className="text-3xl mb-2 group-hover:scale-125 transition-transform block">{country.flag}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-orange-500 transition-colors">{country.name}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{country.region}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      {featured.length > 0 && (
        <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-10"
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Dishes</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Handpicked dishes from around the world</p>
              </div>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((dish, i) => (
                <DishCard key={dish.id} dish={dish} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12"
          >
            Everything you need to explore world cuisine
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: 'World Map',
                description: 'Click any country on our interactive map to instantly browse its authentic traditional dishes.',
                color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
              },
              {
                icon: ChefHat,
                title: 'Step-by-Step Recipes',
                description: 'Follow detailed recipes with ingredients, instructions, and difficulty ratings.',
                color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
              },
              {
                icon: Star,
                title: 'Rate & Review',
                description: 'Find nearby restaurants and share your ratings with the community.',
                color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
              },
              {
                icon: Search,
                title: 'Search & Filter',
                description: 'Search dishes by name, filter by country, ingredient, or difficulty level.',
                color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
              },
              {
                icon: Users,
                title: 'Community Feed',
                description: 'Share photos of dishes you cooked and like content from other food enthusiasts.',
                color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
              },
              {
                icon: Search,
                title: 'Favorites List',
                description: 'Save dishes you love and access them anytime from your personal favorites page.',
                color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                  <feature.icon size={22} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
