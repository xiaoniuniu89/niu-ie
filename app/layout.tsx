import type { Metadata } from "next";
import { Lora, Roboto_Condensed, Nunito } from "next/font/google";
import Script from "next/script";
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
    default: "Niu Web | Web Development for Local Irish Businesses",
    template: "%s | Niu Web",
  },
  description: "Niu Web offers accessible, premium web development solutions for local Irish businesses. We are a website agency based in Westmeath, Ireland, helping you grow online.",
  keywords: ["Web Development", "Local Business", "Ireland", "Westmeath", "Website Agency", "Web Design", "SEO", "Niu Web", "Irish Business"],
  authors: [{ name: "Niu Web", url: "https://www.niu.ie" }],
  creator: "Niu Web",
  publisher: "Niu Web",
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
    title: "Niu Web | Web Development for Local Irish Businesses",
    description: "Accessible, premium web development solutions for local Irish businesses. Based in Westmeath.",
    url: "https://www.niu.ie",
    siteName: "Niu Web",
    locale: "en_IE",
    type: "website",
    images: [
      {
        url: "/niu.webp",
        width: 1200,
        height: 630,
        alt: "Niu Web",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Niu Web | Web Development for Local Irish Businesses",
    description: "Accessible, premium web development solutions for local Irish businesses.",
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
        className={`${lora.variable} ${robotoCondensed.variable} ${nunito.variable} antialiased`}
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
      </body>
    </html>
  );
}
