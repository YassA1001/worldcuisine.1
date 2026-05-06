import { Link } from 'react-router-dom';
import { ChefHat, Globe, Heart, Users } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-400 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center">
                <ChefHat size={16} className="text-white" />
              </div>
              <span className="text-white font-bold text-lg">WorldCuisine</span>
            </div>
            <p className="text-sm leading-relaxed">
              Discover authentic dishes from every corner of the world. Cook, share, and connect through food.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/map" className="hover:text-white transition-colors flex items-center gap-2"><Globe size={14} /> World Map</Link></li>
              <li><Link to="/favorites" className="hover:text-white transition-colors flex items-center gap-2"><Heart size={14} /> Favorites</Link></li>
              <li><Link to="/community" className="hover:text-white transition-colors flex items-center gap-2"><Users size={14} /> Community</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Cuisines</h4>
            <ul className="space-y-2 text-sm">
              {['Italian', 'Japanese', 'Mexican', 'French', 'Indian'].map(c => (
                <li key={c}><span className="hover:text-white transition-colors cursor-pointer">{c}</span></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-center text-xs">
          <p>© 2024 WorldCuisine. Made with passion for food culture worldwide.</p>
        </div>
      </div>
    </footer>
  );
}
