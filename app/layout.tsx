import type { Metadata } from "next";
import { Lora, Roboto_Condensed, Nunito } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.niu.ie"),
  title: {
    default: "niu.ie — Daniel Callaghan",
    template: "%s — niu.ie",
  },
  description: "Writing about music, games, software, and the web. Personal site of Daniel Callaghan (小牛).",
  keywords: ["music", "games", "software", "AI", "web development", "blog", "Daniel Callaghan"],
  authors: [{ name: "Daniel Callaghan", url: "https://www.niu.ie" }],
  creator: "Daniel Callaghan",
  publisher: "Daniel Callaghan",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "niu.ie — Daniel Callaghan",
    description: "Writing about music, games, software, and the web.",
    url: "https://www.niu.ie",
    siteName: "niu.ie",
    locale: "en_IE",
    type: "website",
    images: [
      {
        url: "/niu.webp",
        width: 1200,
        height: 630,
        alt: "niu.ie",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "niu.ie — Daniel Callaghan",
    description: "Writing about music, games, software, and the web.",
    images: ["/niu.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lora.variable} ${robotoCondensed.variable} ${nunito.variable} antialiased min-h-screen flex flex-col`}
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-D9C89TP5C2"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-D9C89TP5C2');
          `}
        </Script>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
