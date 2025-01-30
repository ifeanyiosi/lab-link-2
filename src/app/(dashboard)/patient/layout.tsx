"use client";

import Announcements from "@/components/Announcements";
import EventCalendar from "@/components/EventCalendar";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react"; // Import useEffect

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useAuth();
  console.log(user);
  const router = useRouter();

  // Redirect to sign-in if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    }
  }, [user, loading, router]); // Add dependencies to avoid unnecessary re-runs

  if (loading) {
    return <p>Loading...</p>;
  }

  // If there's no user, don't render anything (the useEffect will handle the redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      {/* LEFT */}
      <div className="w-[20%] h-full md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <Image
            src="/icons/lab-link-logo.png"
            alt="logo"
            width={20}
            height={20}
          />
          <span className="hidden lg:block font-bold">Lablink</span>
        </Link>
        <Menu />
      </div>
      {/* RIGHT */}
      <div className="w-full bg-[#F7F8FA] overflow-y-auto flex ">
        <div className="flex flex-col w-full ">
          <Navbar name={user?.firstName || ""} role={user?.role} />
          <div className="w-full flex flex-col lg:flex-row">
            <div className="w-full">{children}</div>
            <div className="w-full xl:w-1/3 flex flex-col lg:gap-8">
              <EventCalendar />

              <Announcements />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
