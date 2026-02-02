import type { Metadata } from "next";
import { Lora, Roboto_Condensed, Nunito } from "next/font/google";
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
  title: "Niu Agency | High-Quality Web Presence",
  description: "Accessible, premium web solutions for local businesses.",
  icons: {
    icon: "/favicon.ico",
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
        {children}
      </body>
    </html>
  );
}
