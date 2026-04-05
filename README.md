# 재무 데이터 시각화 분석 서비스

누구나 쉽게 이해할 수 있는 재무 데이터 시각화 분석 서비스입니다. 금융감독원의 OpenDART API에서 제공하는 실제 기업 재무 데이터를 기반으로 직관적인 차트와 AI 분석을 제공합니다.

## 주요 기능

### 1. 기업 검색 🔍
- 회사명, 영문명, 종목코드로 빠르게 기업 검색
- 3,864개 상장 기업 데이터 통합
- 실시간 검색 필터링

### 2. 재무 데이터 시각화 📊
- **재무상태표 (Balance Sheet)**
  - 자산, 부채, 자본 비교 분석
  - 당기/전기/전전기 데이터 시각화

- **손익계산서 (Income Statement)**
  - 매출액, 영업이익, 순이익 추이
  - 연도별 성장률 분석

- **수익성 지표**
  - 영업이익률, 순이익률 분석
  - 직관적인 차트 표현

### 3. AI 분석 🤖
- Gemini API를 활용한 자동 재무 분석
- 비전문가도 이해하기 쉬운 한국어 해석
- 재무 건전성, 수익성 트렌드, 투자 고려사항 제시

## 기술 스택

- **프론트엔드**: React 19, TypeScript, Tailwind CSS
- **백엔드**: Next.js 15 (App Router), API Routes
- **데이터 시각화**: Recharts
- **AI**: Google Generative AI (Gemini 3 Flash, Gemini 2.5 Flash)
- **배포**: Vercel
- **데이터 소스**: 금융감독원 OpenDART API

## 설치 및 실행

### 전제 조건
- Node.js 18 이상
- npm 또는 yarn

### 로컬 개발 환경 설정

1. 저장소 클론
```bash
git clone <repository-url>
cd finance
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
```bash
cp .env.example .env.local
```

`.env.local` 파일에 다음 값을 입력합니다:
```
OPENDART_API_KEY=your_opendart_api_key
GEMINI_API_KEY=your_gemini_api_key
```

API 키 발급:
- **OpenDART API**: https://opendart.fss.or.kr 에서 신청
- **Gemini API**: Google AI Studio(https://aistudio.google.com)에서 발급

4. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

## 빌드 및 배포

### 로컬 빌드
```bash
npm run build
npm run start
```

### Vercel 배포

1. Vercel 계정 생성 (https://vercel.com)
2. 저장소 연결
3. 환경 변수 설정
   - Vercel Dashboard > Settings > Environment Variables
   - `OPENDART_API_KEY` 및 `GEMINI_API_KEY` 추가
4. 자동 배포 (푸시 시 자동)

## 프로젝트 구조

```
finance/
├── scripts/
│   └── convert-corps.mjs          # corp.xml → JSON 변환 스크립트
├── public/data/
│   └── corps.json                 # 기업 데이터 (빌드 시 자동 생성)
├── src/
│   ├── app/
│   │   ├── page.tsx               # 메인 검색 페이지
│   │   ├── layout.tsx             # 레이아웃
│   │   ├── company/[corpCode]/    # 재무 분석 페이지
│   │   └── api/
│   │       ├── search/            # 기업 검색 API
│   │       ├── financial/         # OpenDART 프록시 API
│   │       └── analyze/           # AI 분석 API
│   ├── components/
│   │   ├── SearchBar.tsx
│   │   ├── CompanySearchResults.tsx
│   │   ├── FinancialYearSelector.tsx
│   │   ├── FinancialCharts.tsx
│   │   └── AIAnalysisPanel.tsx
│   └── types/
│       └── index.ts               # TypeScript 타입 정의
├── .env.example                   # 환경 변수 템플릿
├── .env.local                     # 로컬 환경 변수 (git 제외)
├── .gitignore
├── next.config.js                 # Next.js 설정
├── tailwind.config.ts             # Tailwind 설정
├── tsconfig.json                  # TypeScript 설정
├── postcss.config.mjs             # PostCSS 설정
├── package.json
└── vercel.json                    # Vercel 배포 설정
```

## API 명세

### GET /api/search
기업명으로 기업 검색

**쿼리 파라미터:**
- `q` (string, required): 검색어 (회사명, 영문명, 코드)

**응답:**
```json
{
  "results": [
    {
      "corp_code": "00126380",
      "corp_name": "삼성전자",
      "corp_eng_name": "SAMSUNG ELECTRONICS CO,.LTD",
      "stock_code": "005930",
      "modify_date": "20250326"
    }
  ]
}
```

### GET /api/financial
기업의 재무 데이터 조회 (OpenDART 프록시)

**쿼리 파라미터:**
- `corp_code` (string, required): 고유번호 (8자리)
- `bsns_year` (string, required): 사업연도 (4자리)
- `reprt_code` (string, required): 보고서 코드
  - `11011`: 사업보고서
  - `11012`: 반기보고서
  - `11013`: 1분기보고서
  - `11014`: 3분기보고서

**응답:**
```json
{
  "status": "success",
  "data": {
    "balanceSheet": [...],
    "incomeStatement": [...]
  }
}
```

### POST /api/analyze
AI를 통한 재무 분석

**요청 본문:**
```json
{
  "balanceSheet": [...],
  "incomeStatement": [...],
  "corpName": "삼성전자"
}
```

**응답:**
```json
{
  "status": "success",
  "analysis": "분석 내용...",
  "timestamp": "2026-04-05T12:00:00Z"
}
```

## 주의사항

- 본 서비스의 AI 분석은 참고용이며, 투자 결정의 근거가 될 수 없습니다.
- 재무 데이터는 OpenDART에서 제공하는 실제 데이터입니다.
- API 키를 절대 공개하지 마세요 (.env.local, .env.*.local 은 .gitignore에 포함됨).
- 투자 판단의 최종 책임은 사용자에게 있습니다.

## 라이센스

MIT License

## 지원

문제가 발생하거나 피드백이 있으시면 이슈를 생성해주세요.

---

**데이터 출처:** [금융감독원 전자공시시스템 (OpenDART)](https://opendart.fss.or.kr)
