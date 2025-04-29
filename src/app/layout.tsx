import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { Red_Hat_Display } from 'next/font/google'
import type { Viewport } from 'next'


const redHatDisplay = Red_Hat_Display({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Fantasy Premier Libre",
  description: "Free FPL Planner. Created by Dominic Williams",
};
 
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={redHatDisplay.className}>
      <body>
        <Navbar />
        {children}
        <footer className="flex h-[100px] w-full bg-black text-white text-sm items-center justify-center">
          <div>Fantasy Premier Libre</div>
        </footer>
      </body>
    </html>
  );
}
