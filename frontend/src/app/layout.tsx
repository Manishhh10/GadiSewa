import type { Metadata } from 'next';
import './globals.css';
import { ReduxProvider } from '@/store/provider';

export const metadata: Metadata = {
  title: 'GadiSewa | Vehicle Booking Platform',
  description: 'The fastest and most reliable way to secure transport in Nepal.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Plus+Jakarta+Sans:wght@600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface-container-lowest font-body-md text-on-surface antialiased">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
