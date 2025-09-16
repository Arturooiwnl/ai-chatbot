import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Sidebar } from "@/components/layouts/Sidebar";
import { ThemeProvider } from "@/components/ThemeProvider"
import { Toaster } from "@/components/ui/sonner"
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
  title: "AI Chat - Assistant",
  description: "Multi-modal AI chat powered by Google models.",
  keywords: ["AI", "Chatbot", "Multi-modal", "Vercel", "Google", "AI SDK"],
  creator: "Arturo Perotto",
  openGraph: {
    title: "AI Chat - Assistant",
    description: "Multi-modal AI chat powered by Google models.",
    url: "https://ai.arturoiwnl.pro/",
    siteName: "Arturo Perotto",
    images: [
      {
        url: "https://ai.arturoiwnl.pro/og/bg-og.jpg",
        alt: "AI chatbot image",
      },
    ],
    locale: "es_EN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Chat - Assistant",
    description: "Multi-modal AI chat powered by Google models.",
    site: "@ArturoPerotto",
    images: [
      {
        url: "https://ai.arturoiwnl.pro/og/bg-og.jpg",
        alt: "AI chatbot image",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background`}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <Sidebar />
        <main> 
          {children}
        </main>
        <Toaster/>
      </ThemeProvider>
      </body>
    </html>
  );
}
