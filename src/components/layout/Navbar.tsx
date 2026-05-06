import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Heart, Users, Shield, LogIn, LogOut, Menu, X, Moon, Sun, ChefHat } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const NAV_LINKS = [
  { to: '/map', label: 'Explore', icon: Globe },
  { to: '/favorites', label: 'Favorites', icon: Heart },
  { to: '/community', label: 'Community', icon: Users },
];

export default function Navbar() {
  const { user, signOut, isAdmin } = useAuth();
  const { isDark, toggle } = useTheme();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <ChefHat size={18} className="text-white" />
            </div>
            <span className={`font-bold text-lg tracking-tight transition-colors ${
              scrolled || menuOpen ? 'text-gray-900 dark:text-white' : 'text-white'
            }`}>
              WorldCuisine
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => {
              const active = location.pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400'
                      : scrolled || menuOpen
                        ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                        : 'text-white/90 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
            {isAdmin && (
              <Link to="/admin" className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                location.pathname === '/admin'
                  ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400'
                  : scrolled
                    ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    : 'text-white/90 hover:bg-white/20'
              }`}>
                <Shield size={15} />
                Admin
              </Link>
            )}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggle}
              className={`p-2 rounded-xl transition-all ${
                scrolled
                  ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  : 'text-white/90 hover:bg-white/20'
              }`}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {user ? (
              <button
                onClick={signOut}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  scrolled
                    ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    : 'text-white/90 hover:bg-white/20'
                }`}
              >
                <LogOut size={15} />
                Sign Out
              </button>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white transition-all shadow-md hover:shadow-lg"
              >
                <LogIn size={15} />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggle}
              className={`p-2 rounded-xl ${scrolled || menuOpen ? 'text-gray-600 dark:text-gray-300' : 'text-white'}`}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMenuOpen(v => !v)}
              className={`p-2 rounded-xl ${scrolled || menuOpen ? 'text-gray-700 dark:text-gray-200' : 'text-white'}`}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 pb-4"
          >
            <div className="pt-3 space-y-1">
              {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
                >
                  <Icon size={16} />
                  {label}
                </Link>
              ))}
              {isAdmin && (
                <Link to="/admin" className="flex items-center gap-2 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium">
                  <Shield size={16} />
                  Admin
                </Link>
              )}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                {user ? (
                  <button onClick={signOut} className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium">
                    <LogOut size={16} />
                    Sign Out
                  </button>
                ) : (
                  <Link to="/auth" className="flex items-center gap-2 px-4 py-3 rounded-xl bg-orange-500 text-white font-medium">
                    <LogIn size={16} />
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
