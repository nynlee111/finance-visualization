'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { FinancialYearSelector } from '@/components/FinancialYearSelector';
import { FinancialCharts } from '@/components/FinancialCharts';
import { AIAnalysisPanel } from '@/components/AIAnalysisPanel';
import type { FinancialItem } from '@/types';

interface FinancialResponse {
  status: string;
  data: {
    balanceSheet: FinancialItem[];
    incomeStatement: FinancialItem[];
  };
}

export default function CompanyPage() {
  const params = useParams();
  const router = useRouter();
  const corpCode = params.corpCode as string;

  const [corpName, setCorpName] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [reportType, setReportType] = useState('11011');
  const [balanceSheet, setBalanceSheet] = useState<FinancialItem[]>([]);
  const [incomeStatement, setIncomeStatement] = useState<FinancialItem[]>([]);
  const [analysis, setAnalysis] = useState('');
  const [isLoadingFinancial, setIsLoadingFinancial] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCorpName = async () => {
      try {
        const response = await fetch('/api/search?q=' + corpCode);
        const data = await response.json();
        const corp = data.results?.find((c: any) => c.corp_code === corpCode);
        if (corp) {
          setCorpName(corp.corp_name);
        }
      } catch (err) {
        console.error('Failed to fetch corp name:', err);
      }
    };

    fetchCorpName();
  }, [corpCode]);

  const fetchFinancialData = useCallback(async () => {
    if (!year || !reportType) {
      setError('연도와 보고서 종류를 선택해주세요.');
      return;
    }

    setError('');
    setIsLoadingFinancial(true);
    setAnalysis('');

    try {
      const response = await fetch(
        `/api/financial?corp_code=${corpCode}&bsns_year=${year}&reprt_code=${reportType}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '데이터를 불러올 수 없습니다.');
      }

      const data: FinancialResponse = await response.json();
      setBalanceSheet(data.data.balanceSheet);
      setIncomeStatement(data.data.incomeStatement);
    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터 로딩 중 오류가 발생했습니다.');
      setBalanceSheet([]);
      setIncomeStatement([]);
    } finally {
      setIsLoadingFinancial(false);
    }
  }, [corpCode, year, reportType]);

  const fetchAnalysis = useCallback(async () => {
    if (balanceSheet.length === 0 || incomeStatement.length === 0) {
      return;
    }

    setIsLoadingAnalysis(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          balanceSheet,
          incomeStatement,
          corpName,
        }),
      });

      console.log('Analyze response status:', response.status);

      if (!response.ok) {
        let errorMessage = 'AI 분석 생성에 실패했습니다.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.details || errorData.error || errorMessage;
        } catch (jsonError) {
          console.error('Failed to parse error response:', jsonError);
          const text = await response.text();
          console.error('Response text:', text.substring(0, 200));
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Analysis data received:', !!data.analysis);
      
      if (data.analysis) {
        setAnalysis(data.analysis);
      } else {
        throw new Error('분석 데이터가 없습니다.');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      const errorMsg =
        err instanceof Error ? err.message : 'AI 분석을 생성하지 못했습니다.';
      setAnalysis(`⚠️ 오류: ${errorMsg}\n\n나중에 다시 시도해주세요.`);
    } finally {
      setIsLoadingAnalysis(false);
    }
  }, [balanceSheet, incomeStatement, corpName]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFinancialData();
    }, 500);

    return () => clearTimeout(timer);
  }, [year, reportType, fetchFinancialData]);

  useEffect(() => {
    if (balanceSheet.length > 0 && incomeStatement.length > 0) {
      fetchAnalysis();
    }
  }, [balanceSheet, incomeStatement, fetchAnalysis]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-soft"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-secondary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-soft" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="relative border-b border-slate-800/50 backdrop-blur-xl bg-slate-900/30 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            돌아가기
          </button>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {corpName || corpCode}
            </h1>
            <p className="text-slate-400">재무 분석 대시보드</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 py-12">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-accent-500/10 border border-accent-500/30 rounded-lg flex items-start gap-3 animate-slide-up">
            <AlertCircle className="w-5 h-5 text-accent-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-accent-300">{error}</p>
              <p className="text-sm text-accent-400/80 mt-1">다른 연도나 보고서를 선택해주세요.</p>
            </div>
          </div>
        )}

        {/* Selector */}
        <div className="mb-8">
          <FinancialYearSelector
            year={year}
            reportType={reportType}
            onYearChange={setYear}
            onReportTypeChange={setReportType}
            isLoading={isLoadingFinancial}
          />
        </div>

        {/* Charts */}
        {isLoadingFinancial && (
          <div className="card p-12 text-center">
            <div className="inline-block">
              <div className="animate-spin w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full"></div>
            </div>
            <p className="mt-4 text-slate-400">재무 데이터를 불러오는 중...</p>
          </div>
        )}

        {balanceSheet.length > 0 && incomeStatement.length > 0 && !isLoadingFinancial && (
          <>
            <div className="mb-8 animate-fade-in">
              <FinancialCharts balanceSheet={balanceSheet} incomeStatement={incomeStatement} />
            </div>

            {/* AI Analysis */}
            <div className="mb-12 animate-fade-in">
              <AIAnalysisPanel
                analysis={analysis}
                isLoading={isLoadingAnalysis}
                corpName={corpName}
              />
            </div>
          </>
        )}

        {!isLoadingFinancial && balanceSheet.length === 0 && !error && (
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-lg p-12 text-center">
            <p className="text-slate-400">
              위에서 연도와 보고서를 선택해주세요.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative border-t border-slate-800/50 backdrop-blur-xl bg-slate-900/30 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-slate-500 text-sm">
            <p>
              데이터 출처:{' '}
              <a
                href="https://opendart.fss.or.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 transition-colors"
              >
                금융감독원 전자공시시스템 (OpenDART)
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
