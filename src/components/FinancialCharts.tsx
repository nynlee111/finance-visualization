'use client';

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { FinancialItem } from '@/types';

interface FinancialChartsProps {
  balanceSheet: FinancialItem[];
  incomeStatement: FinancialItem[];
}

const COLORS = ['#5182ff', '#8b5cf6', '#ef4444', '#f59e0b', '#22c55e'];
const CHART_CONFIG = {
  fill: 'transparent',
  margin: { top: 20, right: 30, left: 0, bottom: 20 },
};

function formatAmount(amount: number): string {
  if (amount >= 1000000000000) {
    return `${(amount / 1000000000000).toFixed(1)}조`;
  }
  if (amount >= 100000000) {
    return `${(amount / 100000000).toFixed(0)}억`;
  }
  return new Intl.NumberFormat('ko-KR').format(amount);
}

function parseAmount(amountStr: string): number {
  return parseInt(amountStr.replace(/,/g, ''), 10) || 0;
}

export function FinancialCharts({ balanceSheet, incomeStatement }: FinancialChartsProps) {
  const assets = balanceSheet.find((item) => item.account_nm === '자산총계');
  const liabilities = balanceSheet.find((item) => item.account_nm === '부채총계');
  const equity = balanceSheet.find((item) => item.account_nm === '자본총계');

  const balanceChartData = [
    {
      name: '자산',
      current: parseAmount(assets?.thstrm_amount || '0'),
      previous: parseAmount(assets?.frmtrm_amount || '0'),
    },
    {
      name: '부채',
      current: parseAmount(liabilities?.thstrm_amount || '0'),
      previous: parseAmount(liabilities?.frmtrm_amount || '0'),
    },
    {
      name: '자본',
      current: parseAmount(equity?.thstrm_amount || '0'),
      previous: parseAmount(equity?.frmtrm_amount || '0'),
    },
  ];

  const revenue = incomeStatement.find((item) => item.account_nm === '매출액');
  const operatingProfit = incomeStatement.find((item) => item.account_nm === '영업이익');
  const netIncome = incomeStatement.find((item) => item.account_nm === '당기순이익(손실)');

  const incomeChartData = [
    {
      name: '매출액',
      current: parseAmount(revenue?.thstrm_amount || '0'),
      previous: parseAmount(revenue?.frmtrm_amount || '0'),
    },
    {
      name: '영업이익',
      current: parseAmount(operatingProfit?.thstrm_amount || '0'),
      previous: parseAmount(operatingProfit?.frmtrm_amount || '0'),
    },
    {
      name: '순이익',
      current: parseAmount(netIncome?.thstrm_amount || '0'),
      previous: parseAmount(netIncome?.frmtrm_amount || '0'),
    },
  ];

  const currentRevenue = parseAmount(revenue?.thstrm_amount || '0');
  const currentOperatingProfit = parseAmount(operatingProfit?.thstrm_amount || '0');
  const currentNetIncome = parseAmount(netIncome?.thstrm_amount || '0');

  const profitabilityData = [
    {
      name: '영업이익률',
      value: currentRevenue > 0 ? (currentOperatingProfit / currentRevenue) * 100 : 0,
    },
    {
      name: '순이익률',
      value: currentRevenue > 0 ? (currentNetIncome / currentRevenue) * 100 : 0,
    },
  ];

  const chartTooltip = (props: any) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700/50 rounded p-2 text-xs">
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatAmount(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* 재무상태표 */}
      <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-6">재무상태표 (자산/부채/자본)</h3>
        <div className="overflow-x-auto">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={balanceChartData} {...CHART_CONFIG}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.3} />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis tickFormatter={(value) => formatAmount(value)} stroke="#94a3b8" width={90} />
              <Tooltip content={chartTooltip} />
              <Legend wrapperStyle={{ color: '#cbd5e1' }} />
              <Bar dataKey="current" fill="#5182ff" name="당기" radius={[8, 8, 0, 0]} />
              <Bar dataKey="previous" fill="#64748b" name="전기" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 손익계산서 */}
      <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-6">손익계산서 (매출액/영업이익/순이익)</h3>
        <div className="overflow-x-auto">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={incomeChartData} {...CHART_CONFIG}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.3} />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis tickFormatter={(value) => formatAmount(value)} stroke="#94a3b8" width={90} />
              <Tooltip content={chartTooltip} />
              <Legend wrapperStyle={{ color: '#cbd5e1' }} />
              <Bar dataKey="current" fill="#8b5cf6" name="당기" radius={[8, 8, 0, 0]} />
              <Bar dataKey="previous" fill="#64748b" name="전기" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 수익성 지표 */}
      <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-6">수익성 지표</h3>
        <div className="overflow-x-auto">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={profitabilityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {profitabilityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `${(value as number).toFixed(2)}%`}
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
