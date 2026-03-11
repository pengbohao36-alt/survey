import { NextFont } from "next/dist/compiled/@next/font";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

export const metadata = {
  title: "Premium Survey Experience",
  description: "A beautiful, dynamic survey application.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-sans flex flex-col min-h-screen">
        <main className="flex-1 flex flex-col w-full h-full relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
