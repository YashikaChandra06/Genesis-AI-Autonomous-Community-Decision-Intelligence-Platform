import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Genesis AI - Community Decision Intelligence Platform",
  description: "AI-powered predictive modeling, smart city mapping, and decision support for communities, governments, and organizations. Leveraged by Gemini AI.",
  keywords: ["Decision Intelligence", "Smart City", "AI Risk Prediction", "Community Health Score", "Emergency Routing"],
  authors: [{ name: "Genesis AI Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased text-foreground bg-background`}
      >
        {children}
      </body>
    </html>
  );
}
