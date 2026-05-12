import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cold Calling Trainer',
  description: 'Walk the script. Hear what the prospect says. Practice out loud. Get hit with objections to stay sharp.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-neutral-950 text-neutral-100 min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
