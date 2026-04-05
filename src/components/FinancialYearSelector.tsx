'use client';

import { Calendar, BookOpen } from 'lucide-react';

interface FinancialYearSelectorProps {
  year: string;
  reportType: string;
  onYearChange: (year: string) => void;
  onReportTypeChange: (type: string) => void;
  isLoading?: boolean;
}

const REPORT_TYPES = [
  { code: '11011', label: '사업보고서' },
  { code: '11013', label: '1분기보고서' },
  { code: '11012', label: '반기보고서' },
  { code: '11014', label: '3분기보고서' },
];

export function FinancialYearSelector({
  year,
  reportType,
  onYearChange,
  onReportTypeChange,
  isLoading,
}: FinancialYearSelectorProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2014 }, (_, i) => currentYear - i);

  return (
    <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-lg p-6">
      <h3 className="text-lg font-bold text-white mb-6">재무 정보 선택</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Year Selector */}
        <div>
          <label className="flex items-center text-sm font-semibold text-slate-300 mb-3">
            <Calendar className="w-4 h-4 mr-2 text-primary-400" />
            사업연도
          </label>
          <select
            value={year}
            onChange={(e) => onYearChange(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <option value="">연도 선택</option>
            {years.map((y) => (
              <option key={y} value={y.toString()}>
                {y}년
              </option>
            ))}
          </select>
        </div>

        {/* Report Type Selector */}
        <div>
          <label className="flex items-center text-sm font-semibold text-slate-300 mb-3">
            <BookOpen className="w-4 h-4 mr-2 text-secondary-400" />
            보고서 종류
          </label>
          <select
            value={reportType}
            onChange={(e) => onReportTypeChange(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <option value="">보고서 선택</option>
            {REPORT_TYPES.map((type) => (
              <option key={type.code} value={type.code}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
