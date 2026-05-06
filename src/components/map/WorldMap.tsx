import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { motion } from 'framer-motion';
import { COUNTRIES, type CountryInfo } from '../../data/countries';

// Using a reliable public topojson source
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// ISO numeric → alpha-2 map for the countries we care about
const NUMERIC_TO_CODE: Record<string, string> = {
  '380': 'IT', '392': 'JP', '484': 'MX', '250': 'FR',
  '764': 'TH', '566': 'NG', '300': 'GR', '156': 'CN',
  '356': 'IN', '604': 'PE', '704': 'VN', '376': 'IL',
  '032': 'AR',
};

interface TooltipState {
  country: CountryInfo;
  x: number;
  y: number;
}

export default function WorldMap() {
  const navigate = useNavigate();
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [position, setPosition] = useState<{ coordinates: [number, number]; zoom: number }>({
    coordinates: [0, 20],
    zoom: 1,
  });

  const handleCountryClick = (code: string) => {
    const country = COUNTRIES.find(c => c.code === code);
    if (country) navigate(`/country/${code}`);
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-900 shadow-2xl border border-slate-700">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 130 }}
        style={{ width: '100%', height: 'auto' }}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={({ zoom, coordinates }) => setPosition({ zoom, coordinates })}
          minZoom={0.8}
          maxZoom={6}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map(geo => {
                const numId = String(geo.id).padStart(3, '0');
                const code = NUMERIC_TO_CODE[numId];
                const isHighlighted = !!code;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => code && handleCountryClick(code)}
                    onMouseEnter={(e) => {
                      if (code) {
                        const country = COUNTRIES.find(c => c.code === code);
                        if (country) {
                          setTooltip({ country, x: e.clientX, y: e.clientY });
                        }
                      }
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    style={{
                      default: {
                        fill: isHighlighted ? '#f97316' : '#1e293b',
                        stroke: '#334155',
                        strokeWidth: 0.5,
                        outline: 'none',
                      },
                      hover: {
                        fill: isHighlighted ? '#fb923c' : '#334155',
                        stroke: '#475569',
                        strokeWidth: 0.5,
                        outline: 'none',
                        cursor: isHighlighted ? 'pointer' : 'default',
                      },
                      pressed: {
                        fill: isHighlighted ? '#ea580c' : '#1e293b',
                        outline: 'none',
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* Markers for featured countries */}
          {COUNTRIES.map(country => (
            <Marker
              key={country.code}
              coordinates={country.coordinates}
              onClick={() => handleCountryClick(country.code)}
            >
              <motion.g
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                style={{ cursor: 'pointer' }}
              >
                <circle r={5} fill="#fff" stroke="#f97316" strokeWidth={2} />
                <circle r={3} fill="#f97316" />
              </motion.g>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip */}
      {tooltip && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-3 pointer-events-none"
          style={{ left: tooltip.x + 12, top: tooltip.y - 60 }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{tooltip.country.flag}</span>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{tooltip.country.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{tooltip.country.region}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-48">Click to explore dishes</p>
        </motion.div>
      )}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex items-center gap-3 text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <span>Featured Cuisine</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-slate-600" />
          <span>Other</span>
        </div>
      </div>

      {/* Zoom controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-1">
        <button
          onClick={() => setPosition(p => ({ ...p, zoom: Math.min(p.zoom * 1.5, 6) }))}
          className="w-8 h-8 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center justify-center text-lg font-bold transition-colors"
        >+</button>
        <button
          onClick={() => setPosition(p => ({ ...p, zoom: Math.max(p.zoom / 1.5, 0.8) }))}
          className="w-8 h-8 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center justify-center text-lg font-bold transition-colors"
        >−</button>
      </div>
    </div>
  );
}
