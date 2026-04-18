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
    <html lang="fr" className={GeistSans.className} suppressHydrationWarning>
      <head>
        {/* Évite le flash de thème au chargement */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}})()`,
          }}
        />
      </head>
      <body className="bg-slate-50 dark:bg-slate-950 antialiased">{children}</body>
    </html>
  );
}
