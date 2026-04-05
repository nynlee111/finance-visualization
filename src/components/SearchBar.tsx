'use client';

import { useState, useCallback, useRef } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import type { Corporation } from '@/types';

interface SearchBarProps {
  onSearch: (results: Corporation[]) => void;
  onLoading?: (loading: boolean) => void;
}

export function SearchBar({ onSearch, onLoading }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 1) {
      onSearch([]);
      setError('');
      return;
    }

    setIsLoading(true);
    setError('');
    onLoading?.(true);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (!response.ok || !data.results) {
        throw new Error('검색에 실패했습니다.');
      }
      
      onSearch(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '검색 중 오류가 발생했습니다.');
      onSearch([]);
    } finally {
      setIsLoading(false);
      onLoading?.(false);
    }
  }, [onSearch, onLoading]);

  const handleInputChange = (value: string) => {
    setQuery(value);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  return (
    <div className="w-full">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition duration-300"></div>
        
        <div className="relative flex items-center">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          
          <input
            type="text"
            placeholder="회사명, 영문명, 종목코드 입력..."
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 text-white placeholder-slate-500 transition-all duration-300"
          />
          
          {isLoading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="animate-spin w-5 h-5 border-2 border-primary-500/30 border-t-primary-500 rounded-full"></div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 p-3 bg-accent-500/10 border border-accent-500/30 rounded-lg animate-slide-up">
          <AlertCircle className="w-4 h-4 text-accent-400 flex-shrink-0" />
          <span className="text-sm text-accent-400">{error}</span>
        </div>
      )}
    </div>
  );
}
