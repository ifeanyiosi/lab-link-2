"use client";

import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react"; // Add useEffect

export default function LabLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Add useEffect for navigation
  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    }
    // Add role check if needed
    if (!loading && user?.role !== "lab") {
      router.push("/"); // Or another route
    }
  }, [user, loading, router]); // Add dependencies

  if (loading) {
    return <p>Loading...</p>;
  }

  // Don't return null here - let useEffect handle the redirect
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <Image
            src="/icons/lab-link-logo.png"
            alt="logo"
            width={32}
            height={32}
          />
          <span className="hidden lg:block font-bold">Lablink</span>
        </Link>
        <Menu />
      </div>
      {/* RIGHT */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col">
        <Navbar
          name={user?.firstName || ""}
          role={(user?.role as "Doctor" | "Patient" | "Admin") || "Patient"}
        />
        {children}
      </div>
    </div>
  );
}
