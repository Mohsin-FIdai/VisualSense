import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import DynamicBackground from "@/components/shared/DynamicBackground";
import ErrorBoundary from "@/components/shared/ErrorBoundary";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "VisualSense — See Beyond the Pixels",
  description:
    "AI Visual Intelligence Platform. Upload any image and let AI understand everything inside it. Ask follow-up questions naturally.",
  keywords: ["AI", "image analysis", "visual intelligence", "OCR", "computer vision"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <ErrorBoundary>
            <DynamicBackground />
            <main className="relative min-h-screen">{children}</main>
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
