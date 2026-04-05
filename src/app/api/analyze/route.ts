import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { FinancialItem } from '@/types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      {
        error: 'Gemini API 키가 설정되지 않았습니다.',
        message: '관리자에게 문의하세요.',
      },
      { status: 500 }
    );
  }

  try {
    const { balanceSheet, incomeStatement, corpName } = await request.json();

    if (!balanceSheet || !incomeStatement) {
      return NextResponse.json(
        { error: '재무 데이터가 필요합니다.' },
        { status: 400 }
      );
    }

    const prompt = generateAnalysisPrompt(balanceSheet, incomeStatement, corpName);

    const client = new GoogleGenerativeAI(GEMINI_API_KEY);

    const modelNames = ['gemini-2.5-flash', 'gemini-2.5-flash-lite'];
    let lastError: Error | null = null;
    
    for (const modelName of modelNames) {
      try {
        const model = client.getGenerativeModel({ model: modelName });
        
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        if (!text || text.trim().length === 0) {
          throw new Error('Gemini API에서 빈 응답을 받았습니다.');
        }

        return NextResponse.json({
          status: 'success',
          analysis: text,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        lastError = error as Error;
      }
    }

    throw lastError || new Error('모든 Gemini 모델을 시도했으나 모두 실패했습니다.');

  } catch (error) {
    console.error('AI analysis error:', error);
    return NextResponse.json(
      {
        error: 'AI 분석 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    );
  }
}

function generateAnalysisPrompt(
  balanceSheet: FinancialItem[],
  incomeStatement: FinancialItem[],
  corpName: string
): string {
  const parseAmount = (amountStr: string): number => {
    return parseInt(amountStr.replace(/,/g, ''), 10) || 0;
  };

  const assets = balanceSheet.find((item) => item.account_nm === '자산총계');
  const liabilities = balanceSheet.find((item) => item.account_nm === '부채총계');
  const equity = balanceSheet.find((item) => item.account_nm === '자본총계');
  const revenue = incomeStatement.find((item) => item.account_nm === '매출액');
  const operatingProfit = incomeStatement.find((item) => item.account_nm === '영업이익');
  const netIncome = incomeStatement.find((item) => item.account_nm === '당기순이익(손실)');

  const currentAssets = assets ? parseAmount(assets.thstrm_amount) : 0;
  const currentLiabilities = liabilities ? parseAmount(liabilities.thstrm_amount) : 0;
  const currentEquity = equity ? parseAmount(equity.thstrm_amount) : 0;
  const currentRevenue = revenue ? parseAmount(revenue.thstrm_amount) : 0;
  const currentOperatingProfit = operatingProfit ? parseAmount(operatingProfit.thstrm_amount) : 0;
  const currentNetIncome = netIncome ? parseAmount(netIncome.thstrm_amount) : 0;

  const previousAssets = assets ? parseAmount(assets.frmtrm_amount) : 0;
  const previousRevenue = revenue ? parseAmount(revenue.frmtrm_amount) : 0;
  const previousOperatingProfit = operatingProfit
    ? parseAmount(operatingProfit.frmtrm_amount)
    : 0;
  const previousNetIncome = netIncome ? parseAmount(netIncome.frmtrm_amount) : 0;

  const debtToEquity = currentEquity > 0 ? (currentLiabilities / currentEquity * 100).toFixed(1) : 'N/A';
  const operatingMargin = currentRevenue > 0 ? (currentOperatingProfit / currentRevenue * 100).toFixed(1) : 'N/A';
  const netMargin = currentRevenue > 0 ? (currentNetIncome / currentRevenue * 100).toFixed(1) : 'N/A';

  const assetGrowth = previousAssets > 0 ? (((currentAssets - previousAssets) / previousAssets) * 100).toFixed(1) : 'N/A';
  const revenueGrowth = previousRevenue > 0 ? (((currentRevenue - previousRevenue) / previousRevenue) * 100).toFixed(1) : 'N/A';
  const netIncomeGrowth = previousNetIncome !== 0 ? (((currentNetIncome - previousNetIncome) / Math.abs(previousNetIncome)) * 100).toFixed(1) : 'N/A';

  return `당신은 비전문가도 쉽게 이해할 수 있는 재무 분석가입니다. 다음 재무 데이터를 한국어로 간단하고 명확하게 분석해주세요.

회사명: ${corpName}

【주요 재무 지표】
- 총자산: ${new Intl.NumberFormat('ko-KR').format(currentAssets)} KRW (전년대비 ${assetGrowth}%)
- 총부채: ${new Intl.NumberFormat('ko-KR').format(currentLiabilities)} KRW
- 총자본: ${new Intl.NumberFormat('ko-KR').format(currentEquity)} KRW
- 부채비율: ${debtToEquity}%

- 매출액: ${new Intl.NumberFormat('ko-KR').format(currentRevenue)} KRW (전년대비 ${revenueGrowth}%)
- 영업이익: ${new Intl.NumberFormat('ko-KR').format(currentOperatingProfit)} KRW
- 순이익: ${new Intl.NumberFormat('ko-KR').format(currentNetIncome)} KRW (전년대비 ${netIncomeGrowth}%)
- 영업이익률: ${operatingMargin}%
- 순이익률: ${netMargin}%

【분석 요청사항】
1. 회사의 재무 건전성을 간단히 설명해주세요. (좋음/보통/주의 수준)
2. 매출과 이익의 트렌드를 설명해주세요.
3. 투자자가 특히 주목해야 할 점을 3가지 언급해주세요.
4. 이 회사의 재무 상태에 대한 최종 평가를 한 문장으로 정리해주세요.

각 항목마다 명확한 제목을 붙이고, 전문 용어 대신 쉬운 표현을 사용해주세요.`;
}
