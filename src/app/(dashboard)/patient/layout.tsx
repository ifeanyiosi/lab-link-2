"use client";

import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useAuth();
  console.log(user);
  const router = useRouter();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    router.push("/sign-in");
    return null;
  }

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
