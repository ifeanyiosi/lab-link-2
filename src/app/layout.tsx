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
};

// Client-side only components
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
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <ClientSideComponents />
        </AuthProvider>
      </body>
    </html>
  );
}
