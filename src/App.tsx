import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import CountryPage from './pages/CountryPage';
import DishPage from './pages/DishPage';
import FavoritesPage from './pages/FavoritesPage';
import CommunityPage from './pages/CommunityPage';
import AuthPage from './pages/AuthPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-200">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/country/:code" element={<CountryPage />} />
              <Route path="/dish/:id" element={<DishPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
            <Footer />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
