import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SEO_SCHEMA } from "@/lib/seoSchema";

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
  metadataBase: new URL("https://adhdly.app"),
  title: {
    default: "ADHDLY — External Executive Function & ADHD Task Paralysis App",
    template: "%s | ADHDLY"
  },
  description: "Don't organize your entire life. Make the next step easier. ADHDLY is the external executive function companion that eliminates ADHD task paralysis with 1 effortless 2-minute micro-step, procedural brown noise, and zero guilt.",
  manifest: "/manifest.webmanifest",
  applicationName: "ADHDLY",
  generator: "Next.js",
  keywords: [
    "ADHD",
    "ADHD app",
    "executive dysfunction",
    "external executive function",
    "ADHD task paralysis",
    "how to overcome ADHD paralysis",
    "2 minute micro-steps",
    "procedural brown noise",
    "time blindness",
    "ADHD focus timer",
    "brain dump voice dictation",
    "neurodivergent productivity",
    "dopamine momentum",
    "doorway launchpad",
    "free ADHD productivity tool"
  ],
  authors: [{ name: "ADHDLY Community & Neurodivergent Research" }],
  creator: "ADHDLY",
  publisher: "ADHDLY",
  alternates: {
    canonical: "https://adhdly.app",
  },
  icons: {
    icon: [
      { url: "/icon.svg?v=adhdly-3", type: "image/svg+xml" },
    ],
    apple: "/logo.svg?v=adhdly-3",
    shortcut: "/icon.svg?v=adhdly-3",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ADHDLY",
  },
  openGraph: {
    title: "ADHDLY — External Executive Function & ADHD Task Paralysis App",
    description: "Don't organize your entire life. Make the next step easier. Built for neurodivergent brains to break task initiation paralysis with 1 effortless 2-minute step.",
    url: "https://adhdly.app",
    siteName: "ADHDLY",
    images: [
      {
        url: "/icon.svg?v=adhdly-3",
        width: 512,
        height: 512,
        alt: "ADHDLY — External Executive Function App Icon",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ADHDLY — External Executive Function & ADHD Task Paralysis App",
    description: "Break ADHD task paralysis with 1 effortless 2-minute step. Procedural brown noise, voice typing & zero guilt.",
    images: ["/icon.svg?v=adhdly-3"],
    creator: "@adhdlyapp",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "productivity",
  classification: "Health, Productivity, Accessibility, Mental Well-being"
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
        <link rel="icon" type="image/svg+xml" href="/icon.svg?v=adhdly-3" />
        <link rel="shortcut icon" type="image/svg+xml" href="/icon.svg?v=adhdly-3" />
        <link rel="apple-touch-icon" href="/logo.svg?v=adhdly-3" />
        <link rel="manifest" href="/manifest.webmanifest" />
        {/* Search Engine, GEO (Generative AI) and AEO (Answer Engine) Structured Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SEO_SCHEMA) }}
        />
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
