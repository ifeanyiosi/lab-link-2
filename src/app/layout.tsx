import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lablink",
  description: "Next.js Appointment Application",
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
