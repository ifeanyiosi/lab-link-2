import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import HomeHeader from "@/components/homepage/HomeHeader";
import Footer from "@/components/homepage/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lablink",
  description: "Next.js Appointment Application",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <HomeHeader />
          <div className="min-h-screen">{children}</div> <Footer /> <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
