import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingAI from '@/components/layout/FloatingAI';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'VetBridge - Connect with Veterinarians',
  description: 'Find and book appointments with veterinarians near you. Pet marketplace, AI health assistant, and more.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingAI />
        </div>
      </body>
    </html>
  );
}
