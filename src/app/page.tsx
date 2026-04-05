'use client';

import { useState } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { CompanySearchResults } from '@/components/CompanySearchResults';
import { BarChart3, TrendingUp, Zap } from 'lucide-react';
import type { Corporation } from '@/types';

export default function Home() {
  const [results, setResults] = useState<Corporation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-soft"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-soft" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="relative border-b border-slate-800/50 backdrop-blur-xl bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-300 via-primary-200 to-primary-300">
                재무 분석 플랫폼
              </h1>
            </div>
            <p className="text-xl text-slate-300 mt-3 font-light">
              AI 기반 실시간 재무 데이터 분석 서비스
            </p>
            <p className="text-slate-400 text-sm mt-2">
              누구나 쉽게 이해할 수 있는 전문적인 재무 인사이트
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 py-12">
        {/* Search Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-xl hover:shadow-glow-primary transition-shadow duration-300">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">기업 검색</h2>
              <p className="text-slate-400">
                분석하고 싶은 기업을 검색해보세요
              </p>
            </div>
            <SearchBar onSearch={setResults} onLoading={setIsLoading} />
          </div>
        </div>

        {/* Results Section */}
        {(results.length > 0 || isLoading) && (
          <div className="mb-16 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">검색 결과</h2>
                {results.length > 0 && (
                  <p className="text-slate-400 text-sm">
                    {results.length}개의 기업을 찾았습니다
                  </p>
                )}
              </div>
            </div>
            <CompanySearchResults results={results} isLoading={isLoading} />
          </div>
        )}

        {/* Features Grid */}
        {results.length === 0 && !isLoading && (
          <div className="grid md:grid-cols-3 gap-6 mt-20">
            {/* Feature 1 */}
            <div className="group bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-primary-500/50 transition-all duration-300 hover:shadow-glow-primary">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">실시간 재무 데이터</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                금융감독원의 OpenDART에서 제공하는 최신 재무 정보를 즉시 확인하세요.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-secondary-500/50 transition-all duration-300 hover:shadow-glow-accent">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">시각화 분석</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                복잡한 재무 데이터를 직관적인 차트로 한눈에 파악하세요.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-accent-500/50 transition-all duration-300 hover:shadow-glow-primary">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI 분석</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Gemini AI가 재무 정보를 쉬운 말로 설명해드립니다.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative border-t border-slate-800/50 backdrop-blur-xl bg-slate-900/30 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-3">재무 분석 플랫폼</h4>
              <p className="text-slate-400 text-sm">
                전문가 수준의 재무 분석을 누구나 쉽게 접근할 수 있게 합니다.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">데이터 소스</h4>
              <a href="https://opendart.fss.or.kr" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 text-sm transition-colors">
                금융감독원 OpenDART
              </a>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">면책사항</h4>
              <p className="text-slate-400 text-sm">
                투자 결정은 전문가 상담 후 신중하게 결정하세요.
              </p>
            </div>
          </div>
          <div className="border-t border-slate-800/50 pt-8 text-center">
            <p className="text-slate-500 text-sm">
              © 2026 재무 분석 플랫폼. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
