'use client';

import Link from 'next/link';
import { ExternalLink, Code } from 'lucide-react';
import type { Corporation } from '@/types';

interface CompanySearchResultsProps {
  results: Corporation[];
  isLoading: boolean;
}

export function CompanySearchResults({ results, isLoading }: CompanySearchResultsProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-slate-700/50 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-slate-700/30 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4 opacity-30">🔍</div>
        <p className="text-slate-400">검색 결과가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {results.map((corp) => (
        <Link key={corp.corp_code} href={`/company/${corp.corp_code}`}>
          <div className="group bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-lg p-4 cursor-pointer hover:border-primary-500/50 transition-all duration-300 hover:shadow-glow-primary hover:translate-x-1">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-white group-hover:text-primary-300 transition-colors">
                  {corp.corp_name}
                </h3>
                <p className="text-sm text-slate-400 mt-1">{corp.corp_eng_name}</p>
                
                <div className="flex gap-3 mt-3 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 bg-primary-500/20 text-primary-300 px-3 py-1 rounded text-xs font-medium border border-primary-500/30 hover:border-primary-500/50 transition-colors">
                    <Code className="w-3 h-3" />
                    종목: {corp.stock_code}
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-400 px-3 py-1 rounded text-xs font-medium border border-slate-700/50">
                    코드: {corp.corp_code}
                  </span>
                </div>
              </div>
              
              <ExternalLink className="text-slate-500 group-hover:text-primary-400 w-5 h-5 flex-shrink-0 ml-3 transition-colors duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
