import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';

export const metadata: Metadata = {
  title: 'Simulateur Denormandie',
  description:
    "Estimez votre investissement immobilier en dispositif Denormandie : réduction d'impôt, loyer maximum, effort d'épargne mensuel.",
  keywords: ['Denormandie', 'simulateur', 'investissement locatif', 'réduction impôt', 'immobilier'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={GeistSans.className}>
      <body className="bg-slate-50 antialiased">{children}</body>
    </html>
  );
}
