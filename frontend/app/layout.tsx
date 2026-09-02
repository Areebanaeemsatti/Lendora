import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ApplicationsProvider } from "@/components/providers/ApplicationsProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lendora | AI Loan Risk Assessment Platform",
  description: "AI-powered loan risk assessment and credit underwriting platform for Pakistani borrowers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-slate-950">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-full bg-slate-50 text-slate-900`}
      >
        <ApplicationsProvider>{children}</ApplicationsProvider>
      </body>
    </html>
  );
}
