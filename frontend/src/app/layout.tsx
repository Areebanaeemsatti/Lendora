import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ApplicationsProvider } from "@/components/providers/ApplicationsProvider";
import { ToastProvider } from "@/components/ui/Toast";
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
    <html lang="en" className="h-full bg-zinc-950">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-full bg-zinc-950 text-zinc-100`}
      >
        <ToastProvider>
          <ApplicationsProvider>{children}</ApplicationsProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

