import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://trysherpa.org'),
  title: 'Sherpa — web browsing, dead simple',
  description: 'Sherpa is an AI guide for effortless web navigation — for everyone and every site.',
  openGraph: {
    title: 'Sherpa — web browsing, dead simple',
    description: 'Sherpa is an AI guide for effortless web navigation — for everyone and every site.',
    url: 'https://trysherpa.org/',
    siteName: 'Sherpa',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Sherpa - Web browsing, dead simple',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sherpa — web browsing, dead simple',
    description: 'Sherpa is an AI guide for effortless web navigation — for everyone and every site.',
    images: ['/og.png'],
  },
  alternates: {
    canonical: 'https://trysherpa.org/',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  )
}
