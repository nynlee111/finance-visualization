import { NextRequest, NextResponse } from 'next/server';
import type { OpenDARTResponse } from '@/types';

const OPENDART_API_KEY = process.env.OPENDART_API_KEY;
const OPENDART_BASE_URL = 'https://opendart.fss.or.kr/api/fnlttSinglAcnt.json';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const corpCode = searchParams.get('corp_code');
  const bsnsYear = searchParams.get('bsns_year');
  const reprtCode = searchParams.get('reprt_code');

  if (!corpCode || !bsnsYear || !reprtCode) {
    return NextResponse.json(
      {
        error: '필수 파라미터가 누락되었습니다.',
        required: ['corp_code', 'bsns_year', 'reprt_code'],
      },
      { status: 400 }
    );
  }

  if (!OPENDART_API_KEY) {
    return NextResponse.json(
      {
        error: 'OpenDART API 키가 설정되지 않았습니다.',
        message: '관리자에게 문의하세요.',
      },
      { status: 500 }
    );
  }

  try {
    const url = new URL(OPENDART_BASE_URL);
    url.searchParams.append('crtfc_key', OPENDART_API_KEY);
    url.searchParams.append('corp_code', corpCode);
    url.searchParams.append('bsns_year', bsnsYear);
    url.searchParams.append('reprt_code', reprtCode);

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`OpenDART API 오류: ${response.status}`);
    }

    const data: OpenDARTResponse = await response.json();

    if (data.status !== '000') {
      return NextResponse.json(
        {
          error: '데이터 조회 실패',
          message: data.message,
          status: data.status,
        },
        { status: 400 }
      );
    }

    const balanceSheet = data.list.filter((item) => item.sj_div === 'BS');
    const incomeStatement = data.list.filter((item) => item.sj_div === 'IS');

    return NextResponse.json({
      status: 'success',
      data: {
        balanceSheet,
        incomeStatement,
      },
    });
  } catch (error) {
    console.error('Financial data fetch error:', error);
    return NextResponse.json(
      {
        error: '재무 데이터 조회 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    );
  }
}
