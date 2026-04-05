import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '재무 분석 플랫폼 | AI 기반 금융 인사이트',
  description: '누구나 쉽게 이해할 수 있는 재무 데이터 시각화 분석 서비스. 실시간 기업 재무 정보와 AI 기반 분석을 제공합니다.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📊</text></svg>',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-slate-950">
        {children}
      </body>
    </html>
  );
}
