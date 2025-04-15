import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { Red_Hat_Display } from 'next/font/google'

const redHatDisplay = Red_Hat_Display({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Fantasy Football Libre",
  description: "Free FPL Planner. Created by Dominic Williams",
};

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
      </body>
    </html>
  );
}
