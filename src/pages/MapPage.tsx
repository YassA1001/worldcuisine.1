import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import WorldMap from '../components/map/WorldMap';
import { COUNTRIES } from '../data/countries';

export default function MapPage() {
  const [search, setSearch] = useState('');

  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.region.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Explore the World</h1>
          <p className="text-gray-500 dark:text-gray-400">Click any highlighted country to browse its traditional dishes.</p>
        </motion.div>

        <div className="mb-8">
          <WorldMap />
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-8">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search countries…"
            className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((country, i) => (
            <motion.div
              key={country.code}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={`/country/${country.code}`}
                className="group flex flex-col items-center p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-lg transition-all text-center"
              >
                <span className="text-4xl mb-3 group-hover:scale-125 transition-transform block">{country.flag}</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white group-hover:text-orange-500 transition-colors">{country.name}</span>
                <span className="text-xs text-gray-400 mt-0.5">{country.region}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
