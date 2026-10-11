import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ApplicationsProvider } from "@/components/providers/ApplicationsProvider";
import { SessionProvider } from "@/components/providers/SessionProvider";
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
  title: "Lendora — Instant Digital Loans in Pakistan",
  description:
    "Get instant digital loans using your JazzCash, Easypaisa, or utility bill history. No bank account needed. Fast, secure, and 100% digital.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-full`}
      >
        {/* Global ambient canvas — the ice-blue gradient (globals.css body),
            deep-navy type and floating cyan orbs sit behind EVERY route
            (auth, dashboard + tabs, landing, desk tools) so the whole app
            shares one frosted-glass surface. */}
        <div
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
          aria-hidden
        >
          <div className="orb orb-cyan -left-40 -top-40 h-[30rem] w-[30rem]" />
          <div className="orb orb-blue -right-48 top-1/3 h-[28rem] w-[28rem]" />
          <div className="orb orb-cyan bottom-0 left-1/3 h-72 w-72" />
        </div>

        <SessionProvider>
          <ApplicationsProvider>{children}</ApplicationsProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
