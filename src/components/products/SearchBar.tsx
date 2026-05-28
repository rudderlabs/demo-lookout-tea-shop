'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { trackProductsSearched, useRudderAnalytics } from '@/lib/analytics';

interface SearchBarProps {
  onSearch: (term: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps): React.JSX.Element {
  const analytics = useRudderAnalytics();
  const [value, setValue] = useState('');
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedTrack = useCallback(
    (query: string) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        if (query.trim() && analytics) {
          trackProductsSearched(analytics, { query: query.trim() });
        }
      }, 300);
    },
    [analytics],
  );

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const newValue = e.target.value;
    setValue(newValue);
    onSearch(newValue);
    debouncedTrack(newValue);
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <svg
          className="h-5 w-5 text-charcoal/40"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search teas..."
        value={value}
        onChange={handleChange}
        className="w-full rounded-xl border border-sage bg-white py-3 pl-11 pr-4 text-charcoal placeholder-charcoal/40 shadow-sm transition-all duration-200 focus:border-matcha focus:outline-none focus:ring-2 focus:ring-matcha/20"
      />
    </div>
  );
}
