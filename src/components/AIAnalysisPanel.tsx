'use client';

import { useState } from 'react';
import { Sparkles, Copy, Check, AlertTriangle } from 'lucide-react';

interface AIAnalysisPanelProps {
  analysis: string;
  isLoading?: boolean;
  corpName?: string;
}

export function AIAnalysisPanel({ analysis, isLoading, corpName }: AIAnalysisPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(analysis);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-white">AI 분석 생성 중...</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-4 bg-gradient-to-r from-slate-700/50 to-slate-600/30 rounded animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  // 에러 메시지 여부 판단
  const isError = analysis.includes('⚠️ 오류:') || analysis.includes('오류');

  return (
    <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-lg p-6 hover:border-accent-500/30 transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isError ? 'bg-accent-500/20' : 'bg-gradient-to-br from-accent-500 to-accent-600'}`}>
            {isError ? (
              <AlertTriangle className="w-5 h-5 text-accent-400" />
            ) : (
              <Sparkles className="w-5 h-5 text-accent-300" />
            )}
          </div>
          <h3 className="text-lg font-bold text-white">
            {corpName ? `${corpName}의 AI 분석` : 'AI 분석'}
          </h3>
        </div>
        {!isError && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 hover:text-white rounded transition-colors duration-200"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                복사됨
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                복사
              </>
            )}
          </button>
        )}
      </div>

      <div className={`rounded-lg p-6 leading-relaxed whitespace-pre-wrap text-sm ${
        isError 
          ? 'bg-accent-500/10 border border-accent-500/20 text-accent-300' 
          : 'bg-slate-900/50 border border-slate-700/30 text-slate-300'
      }`}>
        {analysis}
      </div>

      {!isError && (
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs rounded-lg flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>
            이 AI 분석은 참고용이며, 투자 결정의 기준이 될 수 없습니다. 재무 전문가의 조언을 구하시고 투자 판단의 최종 책임은 사용자에게 있습니다.
          </p>
        </div>
      )}
    </div>
  );
}
