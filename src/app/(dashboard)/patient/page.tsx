"use client";

import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalendar";
import EventCalendar from "@/components/EventCalendar";
import Navbar from "@/components/Navbar";
import QuickActions from "@/components/QuickActions";
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/lib/authHelper";
import { useRouter } from "next/navigation";

const PatientPage = () => {
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
    <div className=" ">
      {/* LEFT */}
      <div className="p-4 flex gap-4 flex-col xl:flex-row">
        <div className="w-full xl:w-2/3">
          <div className="h-full bg-white p-4 rounded-md">
            <h1 className="text-xl font-semibold">
              Welcome, {user.firstName}{" "}
            </h1>
            <QuickActions />
            <BigCalendar />
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-full xl:w-1/3 flex flex-col gap-8">
          <EventCalendar />

          <Announcements />
        </div>
      </div>
    </div>
  );
};

export default PatientPage;
