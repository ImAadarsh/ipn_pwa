import {Lato, League_Spartan} from 'next/font/google';
import type {Metadata, Viewport} from 'next';

import 'swiper/css';
import '../scss/_index.scss';

const lato = Lato({
  weight: '400',
  variable: '--font-lato',
  subsets: ['latin'],
});

const leagueSpartan = League_Spartan({
  variable: '--font-league-spartan',
  subsets: ['latin'],
});

export const viewport: Viewport = {themeColor: '#fff'};
export const metadata: Metadata = {manifest: '/manifest.json'};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0, minimum-scale=1.0'
        />
      </head>
      <body id='app' className={`${lato.variable} ${leagueSpartan.variable}`}>
        {children}
      </body>
    </html>
  );
}
