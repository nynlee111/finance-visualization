import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import type { Corporation } from '@/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q')?.toLowerCase() || '';

  if (!query || query.length < 1) {
    return NextResponse.json({
      results: [],
      message: '검색어를 입력해주세요.',
    });
  }

  try {
    const corpJsonPath = path.join(process.cwd(), 'public', 'data', 'corps.json');

    if (!fs.existsSync(corpJsonPath)) {
      return NextResponse.json(
        { error: '기업 데이터를 찾을 수 없습니다.' },
        { status: 500 }
      );
    }

    const corpData = fs.readFileSync(corpJsonPath, 'utf8');
    const corporations: Corporation[] = JSON.parse(corpData);

    const results = corporations
      .filter((corp) => {
        const nameMatch = corp.corp_name.toLowerCase().includes(query);
        const engNameMatch = corp.corp_eng_name.toLowerCase().includes(query);
        const codeMatch = corp.corp_code.includes(query);
        return nameMatch || engNameMatch || codeMatch;
      })
      .slice(0, 20);

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: '검색 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
