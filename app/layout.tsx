import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: {
    default: '周颖 — 游戏视觉设计师',
    template: '%s',
  },
  description: '周颖的游戏视觉设计作品集，涵盖海外游戏发行、品牌视觉、商店图、活动视觉、广告素材、网页设计与 AIGC。',
  openGraph: {
    title: '周颖 — 游戏视觉设计师',
    description: 'ZHOU YING · GAME VISUAL DESIGNER · PORTFOLIO 2019—2026',
    type: 'website',
    images: [{ url: '/og.png', width: 1536, height: 1024, alt: 'ZHOU YING — GAME VISUAL DESIGNER' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '周颖 — 游戏视觉设计师',
    description: 'ZHOU YING · GAME VISUAL DESIGNER · PORTFOLIO 2019—2026',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
