'use client';

import { useState, useRef, useEffect } from 'react';
import { Zone, City } from '@/lib/types';
import { searchCities } from '@/lib/cities';

const ZONE_BADGE: Record<Zone, string> = {
  'A bis': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
  'A':     'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  'B1':    'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  'B2':    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
};

interface Props {
  zone: Zone;
  onZoneChange: (zone: Zone) => void;
  onCitySelect: (city: City | null) => void;
}

export default function CitySearch({ zone, onZoneChange, onCitySelect }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = query.length >= 1 ? searchCities(query) : [];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (city: City) => {
    setSelectedCity(city);
    setQuery(city.name);
    setOpen(false);
    onZoneChange(city.zone);
    onCitySelect(city);
  };

  const handleClear = () => {
    setSelectedCity(null);
    setQuery('');
    onCitySelect(null);
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-3">
      <div ref={containerRef} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setOpen(true);
            if (!e.target.value) {
              setSelectedCity(null);
              onCitySelect(null);
            }
          }}
          onFocus={() => query && setOpen(true)}
          placeholder="Rechercher une ville éligible…"
          className="input pr-8"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-lg leading-none"
            aria-label="Effacer"
          >
            ×
          </button>
        )}
        {open && results.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-52 overflow-y-auto">
            {results.map(city => (
              <li key={city.name}>
                <button
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => handleSelect(city)}
                  className="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 text-sm"
                >
                  <span className="text-slate-900 dark:text-slate-100">{city.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ZONE_BADGE[city.zone]}`}>
                    Zone {city.zone}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedCity && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Zone détectée automatiquement — vous pouvez la modifier ci-dessous.
        </p>
      )}

      <div>
        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
          Zone locative (plafonds de loyer)
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {(['A bis', 'A', 'B1', 'B2'] as Zone[]).map(z => (
            <button
              key={z}
              onClick={() => {
                onZoneChange(z);
                if (selectedCity && selectedCity.zone !== z) {
                  setSelectedCity(null);
                  setQuery('');
                  onCitySelect(null);
                }
              }}
              className={`py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                zone === z
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500'
              }`}
            >
              {z}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
