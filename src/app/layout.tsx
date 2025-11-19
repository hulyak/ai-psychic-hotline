import type { Metadata } from "next";
import { Cinzel, Crimson_Text, Raleway } from 'next/font/google';
import "./globals.css";

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
});

const crimsonText = Crimson_Text({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-heading-alt',
  display: 'swap',
});

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "AI Psychic Hotline",
  description: "Consult the spirits for mystical guidance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${crimsonText.variable} ${raleway.variable}`}>
      <body>{children}</body>
    </html>
  );
}
