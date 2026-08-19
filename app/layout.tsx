import type { Metadata } from 'next';
import { Inter, IBM_Plex_Mono, Caveat } from 'next/font/google';
import './globals.css';

/*
 * Three distinct font families wired through CSS variables:
 *   --font-sans   : Inter            (body copy)
 *   --font-mono   : IBM Plex Mono    (terminal, code, technical labels)
 *   --font-script : Caveat           (hero name, handwritten accents)
 *
 * next/font self-hosts the files at build time — no network requests at
 * runtime, no CLS, and it generates the CSS variables we reference in
 * tailwind.config.ts under theme.fontFamily.
 */
const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

const script = Caveat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-script',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Khushvinder Thakur | Portfolio',
  description: 'Backend & Android developer, competitive programmer, ECE undergrad at NIT Hamirpur.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} ${script.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
