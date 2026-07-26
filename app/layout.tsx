import type { Metadata } from "next";
import { Lora, Roboto_Condensed, Nunito } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { cookies } from "next/headers";
import { LocaleWrapper } from "@/components/LocaleWrapper";
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
    default: "Niu Web — Web Design & Local SEO for Irish Businesses",
    template: "%s | Niu Web",
  },
  description: "High-performing web design, local Google SEO, and LEO digital grant assistance for small and medium local businesses in Ireland.",
  keywords: ["web development", "web design Ireland", "local SEO", "Co. Westmeath web design", "LEO digital grants", "Grow Digital Voucher", "Trading Online Voucher", "small business website"],
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
    title: "Niu Web — Web Design & Local SEO for Irish Businesses",
    description: "High-performing web design, local Google SEO, and LEO digital grant assistance for small and medium local businesses in Ireland.",
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
    title: "Niu Web — Web Design & Local SEO for Irish Businesses",
    description: "High-performing web design, local Google SEO, and LEO digital grant assistance for small and medium local businesses in Ireland.",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value ?? "enUs";
  const localeMap: Record<string, string> = { enUs: "en", ga: "ga", zhCn: "zh", de: "de", es: "es", fr: "fr", pl: "pl", ro: "ro", uk: "uk", lt: "lt", pt: "pt" };
  const lang = localeMap[localeCookie] ?? "en";

  return (
    <html lang={lang} suppressHydrationWarning>
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
        <LocaleWrapper>
          {children}
        </LocaleWrapper>
        <Analytics />
      </body>
    </html>
  );
}
