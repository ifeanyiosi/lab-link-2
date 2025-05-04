import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lab Link - Book & Manage Lab Appointments",
  description:
    "Lab Link is a modern appointment scheduling platform for medical and diagnostic labs. Easily book, manage, and track lab tests online.",
  keywords: [
    "lab appointments",
    "medical testing",
    "diagnostic labs",
    "book lab test",
    "healthcare scheduling",
  ],
  openGraph: {
    title: "Lab Link - Effortless Lab Appointment Scheduling",
    description:
      "Seamlessly book and manage lab tests with Lab Link. Fast, secure, and hassle-free medical diagnostics booking.",
    type: "website",
    url: "https://lab-link-2.vercel.app",
  },
  themeColor: "#0F172A", // match your branding color
};

const ClientSideComponents = dynamic(
  () => import("@/components/ClientSideComponents"),
  { ssr: false }
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Manifest and Icons */}
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="apple-touch-icon"
          sizes="192x192"
          href="/icons/lab-link-logo.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="512x512"
          href="/icons/lab-link-logo.png"
        />

        {/* PWA Meta Tags */}
        <meta name="theme-color" content="#0F172A" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body suppressHydrationWarning={true} className={inter.className}>
        <AuthProvider>
          {children}
          <ClientSideComponents />
        </AuthProvider>
      </body>
    </html>
  );
}
