import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fontSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ADHDLY — Your External Executive Function",
  description: "Don't organize your entire life. Make the next step easier. ADHD-focused micro-steps, procedural focus noise, and zero-guilt productivity.",
  manifest: "/manifest.webmanifest",
  applicationName: "ADHDLY",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/logo.svg",
    shortcut: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ADHDLY",
  },
  keywords: [
    "ADHD", "executive function", "task decomposition", "brown noise",
    "time blindness", "ADHD focus timer", "brain dump", "PWA productivity"
  ],
  authors: [{ name: "ADHDLY Team" }],
  openGraph: {
    title: "ADHDLY — External Executive Function",
    description: "Don't organize your entire life. Make the next step easier.",
    siteName: "ADHDLY",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#080c14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontMono.variable} dark`}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body className="min-h-screen bg-[#06080f] text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white overflow-x-hidden bg-grid-subtle">
        {/* Subtle ambient gradient backdrops for depth */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-600/12 rounded-full blur-[140px]" />
          <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] bg-sky-600/10 rounded-full blur-[160px]" />
          <div className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] bg-emerald-600/08 rounded-full blur-[150px]" />
        </div>
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
